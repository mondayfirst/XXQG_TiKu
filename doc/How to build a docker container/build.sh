mkdir temp_dockerfile
cp Dockerfile temp_dockerfile/Dockerfile

cd temp_dockerfile; git clone https://github.com/mondayfirst/XXQG_TiKu.git; cd ..

# Build
docker build -t mondayfirst/xxqgtiku-server:latest ./temp_dockerfile
# Delete TempFiles
rm -r temp_dockerfile
