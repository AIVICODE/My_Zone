import osmnx as ox
import geopandas as gpd
import pandas as pd
import numpy as np
from shapely.geometry import Point, box
from app.models.schemas import AnalysisRequest, AnalysisResponse
from app.services.cobertura_module import detectar_zonas_sin_cobertura, crear_poligono_sin_cobertura

async def process_analysis(data: AnalysisRequest):
    print(f"Procesando análisis para: {data}")
    point = (data.lat, data.lng)
    radius = 500

    try:
        tags = {
            'amenity': True,
            'shop': True,
            'tourism': True,
            'office': True,
            'building': 'residential',
            'highway': ['primary', 'secondary', 'tertiary', 'trunk', 'motorway', 'bus_stop'],
            'leisure': ['park', 'garden', 'common', 'playground'],
            'place': 'square',
            'landuse': 'recreation_ground'
        }

        try:
            gdf = ox.features_from_point(point, tags, dist=radius)
            print(f"Total features encontrados: {len(gdf)}")
        except Exception as e:
            print(f"No se encontraron datos relevantes: {e}")
            
            # GeoJSON vacío pero válido
            empty_geojson = {
                "type": "FeatureCollection",
                "features": []
            }
            
            return AnalysisResponse(
                recomendacion="Zona sin datos suficientes para análisis",
                resumen="No se encontraron datos en la zona seleccionada.",
                poligono_sin_cobertura=empty_geojson,
                stats={"coverage": 0, "traffic": 0, "comfort": 0}
            )
        
        if gdf.empty:
            print("No se encontraron features en la zona.")
            return AnalysisResponse(
                recomendacion="Zona sin datos suficientes para análisis",
                resumen="No se encontraron datos en la zona seleccionada."
            )

        # Validación segura
        def safe_len(column, valid_values):
            if column in gdf.columns:
                return len(gdf[gdf[column].isin(valid_values)])
            return 0

        num_principal_streets = safe_len('highway', ['primary', 'secondary', 'tertiary', 'trunk', 'motorway'])
        num_paradas = safe_len('highway', ['bus_stop'])
        num_residences = safe_len('building', ['residential'])
        num_hotels = safe_len('tourism', ['hotel'])
        num_parking = safe_len('amenity', ['parking'])
        num_banks = safe_len('amenity', ['bank'])
        num_offices = len(gdf[gdf['office'].notna()]) if 'office' in gdf.columns else 0

        # Parques
        parks_list = []
        if 'leisure' in gdf.columns:
            parks = gdf[gdf['leisure'].isin(['park', 'garden', 'common', 'playground'])]
            parks_list.extend(parks['name'].dropna().tolist())
        if 'place' in gdf.columns:
            squares = gdf[gdf['place'] == 'square']
            parks_list.extend(squares['name'].dropna().tolist())
        if 'landuse' in gdf.columns:
            recreation = gdf[(gdf['landuse'] == 'recreation_ground') & (gdf.geometry.type.isin(['Polygon', 'MultiPolygon']))]
            parks_list.extend(recreation['name'].dropna().tolist())
        num_parks = len(parks_list)

        # Negocios similares
        field, value = data.rubro.split('=', 1)
        similares = gdf[gdf.get(field) == value]
        num_similares = len(similares)

        min_dist = avg_dist = None
        if num_similares > 0:
            user_point = Point(data.lng, data.lat)
            similares = similares.set_geometry('geometry')
            similares['distance_m'] = similares.geometry.distance(user_point) * 111_139
            min_dist = round(similares['distance_m'].min(), 1)
            avg_dist = round(similares['distance_m'].mean(), 1)

        # Zonas sin cobertura
        zonas_sin_cobertura = detectar_zonas_sin_cobertura(data, similares, 500, 100)
        poligono = crear_poligono_sin_cobertura(zonas_sin_cobertura, similares)

        # Área de cobertura
        percentage_coverage = 0
        if poligono and not poligono.is_empty:
            poly_gdf = gpd.GeoDataFrame(geometry=[poligono], crs="EPSG:4326").to_crs(epsg=3857)
            centro = Point(data.lng, data.lat)
            centro_gdf = gpd.GeoDataFrame(geometry=[centro], crs="EPSG:4326").to_crs(epsg=3857)
            centro_point = centro_gdf.geometry.iloc[0]
            minx, miny = centro_point.x - radius, centro_point.y - radius
            maxx, maxy = centro_point.x + radius, centro_point.y + radius
            square = box(minx, miny, maxx, maxy)
            clipped_poly = poly_gdf.geometry.iloc[0].intersection(square)
            coverage_area = clipped_poly.area
            total_area = (2 * radius) ** 2
            percentage_coverage = round((coverage_area / total_area) * 100, 2)

        # Índices
        traffic_index = num_principal_streets + num_paradas
        percentage_traffic = min(100, traffic_index * 10)

        comfort_score = num_banks + num_parks + num_hotels + num_residences
        percentage_comfort = min(100, comfort_score * 10)

        poligono_geojson = gpd.GeoSeries([poligono]).__geo_interface__ if poligono else {}

        resumen = (
            f"Total negocios: {safe_len('amenity', gdf['amenity'].dropna().unique().tolist())}."
            f"Calles principales: {num_principal_streets}."
            f"Residencias: {num_residences}, Hoteles: {num_hotels}, Transporte: {num_paradas}, "
            f"Estacionamientos: {num_parking}, Bancos: {num_banks}, Oficinas: {num_offices}."
            f"Parques/plazas: {num_parks} ({parks_list})."
            f"Negocios similares a '{data.rubro}': {num_similares} encontrados."
            f"Zonas sin cobertura detectadas: {len(zonas_sin_cobertura)}"
        )

        if min_dist is not None:
            resumen += f"\nNegocio similar más cercano a {min_dist} metros, distancia media: {avg_dist} metros."

        print(resumen)

        return AnalysisResponse(
            recomendacion=f"¡La ubicación en {data.direccion} para un {data.rubro} parece prometedora!",
            resumen=resumen,
            poligono_sin_cobertura=poligono_geojson,
            stats={
                "coverage": percentage_coverage,
                "traffic": percentage_traffic,
                "comfort": percentage_comfort
            }
        )

    except Exception as e:
        print(f"Error al obtener datos de OSM: {e}")
        return AnalysisResponse(
            recomendacion="Error al analizar ubicación",
            resumen=str(e)
        )
