import os
from fastapi import FastAPI, APIRouter, Request, Security, HTTPException
from fastapi.responses import StreamingResponse
from fastapi.security import APIKeyHeader

facility_router = APIRouter()
ZT_HEADER = APIKeyHeader(name="X-Zero-Trust-Token")

async def verify_zero_trust(token: str = Security(ZT_HEADER)):
    if token != "EXPECTED_EDGE_INJECTED_TOKEN":
        raise HTTPException(status_code=403, detail="Zero Trust Layer: Facility Access Denied")
    return token

@facility_router.get("/facility/layout/{property_id}", dependencies=[Security(verify_zero_trust)])
async def get_facility_layout(property_id: str):
    return {
        "property_id": property_id,
        "total_square_footage": 7000,
        "zones": {
            "front_end_store": {
                "type": "Retail & Omni-Showroom",
                "footprint_sqft": 800,
                "features": ["AR Smart Mirrors", "VIP Elite Vault Terminal", "Zero-Friction NFC Checkout"]
            },
            "back_room_logistics": {
                "type": "Micro-Fulfillment Forge",
                "footprint_sqft": 2200,
                "capacity": "35,000 Vertical Storage Bricks",
                "capabilities": ["15-Minute Order-to-Dispatch Workflow", "Automated Kubernetes-Managed Retrieval Bots", "Air-Gapped Local Server Hosting"]
            },
            "house_design_recreation": {
                "type": "Executive Residence & Recreation Center",
                "footprint_sqft": 4000,
                "structural_specs": {
                    "interior_framing": "CityPost Cable Railing Systems for open sightlines",
                    "exterior_roofing": "CertainTeed Black Pearl Carriage House Shingles",
                    "layout": "Open-concept recreation floor with private executive suites above"
                }
            }
        },
        "status": "OPERATIONAL"
    }

@facility_router.get("/facility/render/{property_id}", dependencies=[Security(verify_zero_trust)])
async def stream_3d_layout(property_id: str, request: Request):
    file_path = f"/airgap/blueprints/{property_id}_master.glb"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="3D Blueprint not found")
        
    file_size = os.path.getsize(file_path)
    range_header = request.headers.get("Range")
    
    if not range_header:
        def file_iterator():
            with open(file_path, "rb") as f:
                yield from f
        return StreamingResponse(file_iterator(), media_type="model/gltf-binary")
        
    byte_range = range_header.strip().split("=")[-1]
    start_str, end_str = byte_range.split("-")
    start = int(start_str)
    end = int(end_str) if end_str else file_size - 1
    chunk_size = end - start + 1
    
    def ranged_binary_generator(path, start_byte, total_bytes, chunk=1024 * 512):
        remaining = total_bytes
        with open(path, "rb") as f:
            f.seek(start_byte)
            while remaining > 0:
                data = f.read(min(chunk, remaining))
                if not data: break
                yield data
                remaining -= len(data)
                
    headers = {
        "Content-Range": f"bytes {start}-{end}/{file_size}",
        "Accept-Ranges": "bytes",
        "Content-Length": str(chunk_size),
    }
    return StreamingResponse(ranged_binary_generator(file_path, start, chunk_size), status_code=206, headers=headers, media_type="model/gltf-binary")

app = FastAPI(title="NEXUS Complex Logistics Engine")
app.include_router(facility_router)
