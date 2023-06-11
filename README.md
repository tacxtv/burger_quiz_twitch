# Burger Quiz Twitch
## Résumé
Deux équipes (Ketchup & Mayo) s'affrontent. Le premier qui buzz bloque le buzzer de l'autre équipe pendant 5 secondes et affichent la lettre de léquipe à l'écran.

Utilisation d'un SSE pour synchroniser les deux équipes ensemblent. Le sse utilisera une base de données type **Redis** ou MongoDB afin de profiter des fonctionnalités "temps réel" de leurs technlologies. Une troisième page (obs) sera sychronisée et non interractive.

A l'avenir, prévoir la possibilité de buzzer avec un endpoint d'api directement afin de 
brancher un buzzer physique.

---------

**!!! VOIR POUR GERER UN CODE DE PARTIE !!!**

Les pages scores animateur et grandmiam doivent permettre de modifier le cours de la partie.

------

Stocker les parties dans **MongoDB** utiliser _id pour gerer les acces
