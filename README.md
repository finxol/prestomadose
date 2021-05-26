# Presto Ma Dose

Outil de recherche automatisée de rendez-vous pour la vaccination contre la COVID-19

## Utiliser sur Doctolib
Les instructions ci-dessous permettront de créer un bouton sur le site Doctolib qui lance la recherche automatique de rendez-vous

Copier ce code et lancez-le dans la console :

```javascript
let script = document.createElement('script');
script.src = "https://cdn.jsdelivr.net/gh/user038418/prestomadose/dose_covid.js";
document.body.appendChild(script);

let button = document.createElement('button');
button.setAttribute('onclick', 'desktop()');
button.innerText = "Trouver un rendez-vous";
button.id = "prestoMaDose";
button.setAttribute('style', "position: fixed;bottom: 0;right: 0;z-index: 11;background-color: #0596de;border: none;border-radius: .5rem 0 0;font-size: 1.5rem;padding: .5rem 1rem;color: #ffffff;box-shadow: 0 2px 10px 0 rgb(67 95 113 / 69%);");
document.body.appendChild(button);
```

### Comment utiliser la console ?
1. **Cliquer sur `F12`**

<img src="img/f12_key.webp" width="60%" alt="F12 Key">

2. **Cliquer sur l'onglet console**

<img src="img/console.webp" width="60%" alt="DevTools Console">

3. **Coller le code ci-dessus**

<img src="img/paste.webp" width="60%" alt="Coller le code">
