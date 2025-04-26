<template>
    <div class="not-found">
        <img src="/public/InstaCars.png" alt="" width="100px">
        <h1>Page non trouvée</h1>
        <p>Désolé, la page que vous recherchez n'existe pas.</p>
        <img src="/public/voiture.jpg" alt="Voiture perdue" width="35%">
        <router-link to="/" class="home-link">Retour à l'accueil</router-link>
    </div>
</template>

<style scoped>
    .not-found {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        padding: 50px 20px;
        color: #333;
    }

    .not-found h1 {
        font-size: 3rem;
        margin-bottom: 20px;
        color: #ff6b6b;
    }

    .not-found p {
        font-size: 1.2rem;
        margin-bottom: 30px;
    }

    .not-found img {
        /* width: 300px; */
        max-width: 80%;
        margin-bottom: 30px;
        border-radius: 10px;
        box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .home-link {
        display: inline-block;
        padding: 12px 24px;
        background-color: #3498db;
        color: white;
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        transition: background-color 0.3s;
    }

    .home-link:hover {
        background-color: #2980b9;
    }
</style>