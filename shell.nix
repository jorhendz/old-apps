with import <nixpkgs> {};

stdenv.mkDerivation {
    name = "boernebasen";
    buildInputs = [
      git
      docker
      docker-compose
      heroku
      elmPackages.elm
      elmPackages.elm-live
      inetutils
      python38Packages.python
      python38Packages.django
      python38Packages.django-storages
      python38Packages.pillow
      python38Packages.pymysql
      python38Packages.gunicorn
      python38Packages.boto3
      python38Packages.whitenoise
      python38Packages.dj-database-url
      python38Packages.psycopg2
      python38Packages.djangorestframework
      python38Packages.markdown
      python38Packages.django-filter
      python38Packages.flake8
    ];
    shellHook = ''
    '';
}
