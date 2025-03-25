from pydantic import BaseModel
from typing import Optional, Dict, Any

class AnalysisRequest(BaseModel):
    direccion: str
    lat: float
    lng: float
    rubro: str
    inversion: float

class AnalysisResponse(BaseModel):
    recomendacion: str
    resumen: str = None  # Opcional, si lo usás después
    poligono_sin_cobertura: Optional[Dict[str, Any]] = None  # Nuevo campo
    stats: Dict[str, float] = None

