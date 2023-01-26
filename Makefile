
ifeq ($(env), prod) 
ENV := heroku
PYTHON := ${ENV} run python 
else
ENV := docker-compose
PYTHON := ${ENV} run boernebasen python 
endif

MANAGE := ${PYTHON} manage.py


ifdef args
ARGS := ${args}
else
ARGS :=
endif

SHELL := bash
.PHONY: help

help: ## This help message
	@echo Børnebasen development env
	@echo To run relevant commands in production add \`make TARGET env=prod\`
	@echo The following targets are defined:
	@echo 
	@echo -e "$$(grep -hE '^\S+:.*##' $(MAKEFILE_LIST) | sed -e 's/:.*##\s*/:/' -e 's/^\(.\+\):\(.*\)/\\x1b[32m\1\\x1b[m:\2/' | column -c2 -t -s :)"


run: ## Run a development server on this machine
	docker-compose up --build ${ARGS}

migrate: ## Migrate the DB using the Django migration functionality
	${MANAGE} migrate ${ARGS}

makemigrations: ## Create migrations using Django 
	${MANAGE} makemigrations ${ARGS}

shell: ## Create a Django shell
	${MANAGE} shell ${ARGS}

set_zero_postal_codes: ## Set all postal codes with value 0 to None
	${MANAGE} shell --command "import providers.set_zero_postal_codes" ${ARGS}

populate_tables: ## Populate the DB with data from the fixtures in providers/fixtures/
	${MANAGE} loaddata providers/fixtures/* ${ARGS}

mirror_old:
	${MANAGE} shell --command "import providers.mirror_old" ${ARGS}

clean_providers: ## Go through all providers in the DB and clean them
	${MANAGE} shell --command "import providers.clean_all_providers" ${ARGS}
	
set_postalcodes: ## Calculate postal codes base on the regions set on providers
	${MANAGE} shell --command "import providers.set_postalcodes" ${ARGS}

check_area_overlap: ## Finds how many postal codes that overlap between different areas
	${MANAGE} shell --command "import providers.check_area_overlap" ${ARGS}

manage: ## Run \`python manage.py\' in the relevant environment
	${MANAGE} ${ARGS}

createsuperuser: ## Create a Django superuser
	${MANAGE} createsuperuser ${ARGS}

collectstatic: ## Collect the static files
	${MANAGE} collectstatic ${ARGS}

deploy: ## Deploys whatever is on the production branch to production
	./deploy.sh

elm-watch: ## Start an Elm development server
	(cd Elm && elm-live src/Search.elm src/Services.elm --no-server -- --output="../providers/static/search.js"  ) ${ARGS}

test: ## Run the tests within a directory, e.g. "make test providers"
	${MANAGE} test ${ARGS}

report: ## Make Analytics reports
	${MANAGE} shell --command "from analytics.scripts.muni_report import *" ${ARGS}

df: ## Make Analytics reports
	${MANAGE} shell --command "from analytics.scripts.to_dataframe import *" ${ARGS}
