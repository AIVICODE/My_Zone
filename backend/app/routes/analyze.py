from fastapi import APIRouter
from app.models.schemas import AnalysisRequest,AnalysisResponse
from app.services.analysis_service import process_analysis

router = APIRouter()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_location(data: AnalysisRequest):
    result = await process_analysis(data)
    return result  