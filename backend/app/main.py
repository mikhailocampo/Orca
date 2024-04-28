from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.router import router
from .database import engine, Base

app = FastAPI()

app.include_router(router)

Base.metadata.create_all(bind=engine)