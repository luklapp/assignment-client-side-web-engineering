# Task 05: Serviceworkers

*Forked from JPeer264/JPeer.at*

Service worker ist in `src/assets/js/app.js` ganz unten definiert.

`sw.js` ist in `src/sw.js`

### Ergebnisse

| Variante | Data transferred | Finish        | DOMContentLoaded | Load   |
| :-------- | :---------------- | :------------- | :---------------- | :----- |
| Ohne Caching | 1,2 MB         | 1,28 s        | 0,869 s          | 1,10 s |
| Mit Caching | 2,7 kb | 1,012 s | 0.672 s | 0,888 s |
| Mit Serviceworker | 0 b | 0,986 s | 0,637 s | 0,931 s |

(Ergebnisse für *Finish*, *DOMContentLoaded* und *Load* jeweils Durchschnitt aus 5 Durchgängen mit Chrome)

Die Unterschiede sind relativ klein, da die Assets bereits minifiziert sind. Dennoch kann man gut erkennen, dass Caching mittels Serviceworkers einen Geschwindigkeitsvorteil bringt!

### Screenshots

![Ohne Caching][screenshots/no_caching.png]
![Mit Caching][screenshots/caching.png]
![Serviceworker][screenshots/serviceworker.png]