import setuptools
import os, shutil, sys, glob

package_name = "xxqg_tiku_server"
import_name = "xxqg_tiku_server"

def check_requires(requires: list):
    pip_file = "pip.exe" if "win" in sys.platform else "pip"
    pip_paths = [
        os.path.join(os.path.dirname(sys.executable), "Scripts", pip_file),
        os.path.join(os.path.dirname(sys.executable), pip_file),
    ]
    for _path in pip_paths:
        if os.path.exists(_path):
            pip_exe = _path
            break
    for require in requires:
        try:
            __import__(require)
        except:
            os.system(f"{pip_exe} install {require}")


# Setuptools Support
check_requires(["setuptools"])
import setuptools

# Path Support
os.chdir(os.path.dirname(__file__))
if os.path.isdir('build'):
    print('INFO del dir ', 'build')
    shutil.rmtree('build')


# Version Read
with open(f"src/{import_name}/__init__.py", "r", encoding="utf8") as f:
    for line in f.readlines():
        if line.startswith("__version__"):
            delim = '"' if '"' in line else "'"
            version = line.split(delim)[1]
            break
    else:
        print("Can't find version! Stop Here!")
        exit(1)

# README Doc
with open("README.md", "r", encoding="utf8") as f:
    long_description = f.read()

setuptools.setup(
    name=package_name,  #应用名
    author='mondayfirst',
    version=version,  #版本号
    description=f"{package_name}",
    long_description=long_description,
    long_description_content_type="text/markdown",
    # package_dir={"":"."},
    packages=setuptools.find_packages("src"),  #包括在安装包内的Python包
    package_dir={"": "src"},
    zip_safe=False,
    install_requires=[  #自动安装依赖
        "setuptools",
        "flask",
        "gunicorn",
        "gevent",
    ],
    extras_require={
        "test": ["pytest", "requests"],
    },
    include_package_data=True,  #启用清单文件MANIFEST.in,包含数据文件
    python_requires='>=3.8',
    classifiers=[
        "Development Status :: 1 - alpha",
        "Programming Language :: Python :: 3.6+",
        "Intended Audience :: Developers",
        "License :: OSI Approved :: Apache Software License",
        "Operating System :: MacOS",
        "Operating System :: POSIX :: Linux",
        "Operating System :: Microsoft :: Windows",
    ],
)

if os.path.exists(package_name + '.egg-info'):
    print('INFO del dir ', 'egg-info')
    shutil.rmtree(package_name + '.egg-info')