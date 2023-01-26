# Readme Style Guide for app.boernebasen.dk

## Extend 'base.html'
For continuity altways begin a html-file by extending base.html. This is done in Django by
```bash
{% extend "base.html" %}
```
In base.html there are different 'blocks'. These blocks can be overwritten in the new html-file by 
```bash
{% block content %}
...
{% endblock %}
```


## Genereate customized bulma
To get our own colours on the website sass is used as described in 
[bulma sass](https://bulma.io/documentation/customize/with-sass-cli/)

Firstly sass is installed with gem or apt install
```bash
gem install sass
```
or

```bash
apt install ruby-sass
```

### Update the bb-style.scss file
Then to customize the styling update the file **bb-styles.scss** and placing one self in the static folder of the git project, the following bash command generates a new custom css-file. 

```bash
sass --sourcemap=none sass/bb-styles.scss:bulma/css/bb-styles.css
```

