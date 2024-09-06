# Dockerfile for FastAPI backend
FROM python:3.12

WORKDIR /app

# Copia el archivo de requisitos y luego instala las dependencias
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copia el resto de los archivos del backend
COPY . .

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]