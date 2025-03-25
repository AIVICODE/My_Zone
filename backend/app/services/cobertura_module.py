import numpy as np
from shapely.geometry import Point
import geopandas as gpd

# Este módulo detecta zonas sin cobertura de negocios similares

def detectar_zonas_sin_cobertura(data, similares_gdf, radius, distancia_cobertura_m):
    """
    Detecta puntos dentro de un radio que no tienen negocios similares cercanos.

    Args:
        data (AnalysisRequest): Datos de entrada con lat/lng.
        similares_gdf (GeoDataFrame): Negocios similares encontrados.
        radius (int): Radio general en metros alrededor del punto.
        distancia_cobertura_m (int): Distancia considerada como "cobertura" en metros.

    Returns:
        List[Tuple[float, float]]: Lista de coordenadas (lat, lng) sin cobertura cercana.
    """
    print("Iniciando detección de zonas sin cobertura...")

    deg_spacing = distancia_cobertura_m / 111_139  # Aprox. grados por metro
    lat_min = data.lat - (radius / 111_139)
    lat_max = data.lat + (radius / 111_139)
    lng_min = data.lng - (radius / 111_139)
    lng_max = data.lng + (radius / 111_139)

    lats = np.arange(lat_min, lat_max, deg_spacing)
    lngs = np.arange(lng_min, lng_max, deg_spacing)

    puntos_sin_cobertura = []

    for lat in lats:
        for lng in lngs:
            test_point = Point(lng, lat)
            nearby = similares_gdf.geometry.distance(test_point) * 111_139  # a metros
            if all(nearby > distancia_cobertura_m):
                # Convertimos a float normal
                puntos_sin_cobertura.append( (float(round(lat, 6)), float(round(lng, 6))) )

    print(f"Zonas sin cobertura detectadas: {len(puntos_sin_cobertura)} puntos.")
    return puntos_sin_cobertura



def crear_poligono_sin_cobertura(lista_puntos, similares_gdf):
    geometries = [Point(lng, lat) for lat, lng in lista_puntos]
    puntos_gdf = gpd.GeoDataFrame(geometry=geometries)
    
    # Polígono envolvente
    poligono = puntos_gdf.unary_union.convex_hull
    
    # Unir geometrías de competencia
    if not similares_gdf.empty:
        competencia_geom = similares_gdf.geometry.unary_union
        
        # Aplicar diferencia: restamos área cercana a la competencia
        poligono = poligono.difference(competencia_geom.buffer(0.0005))  # Ajustar buffer según metros

    return poligono

