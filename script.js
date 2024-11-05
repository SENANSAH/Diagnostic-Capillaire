
let model, labelContainer, maxPredictions;

// Charger le modèle Teachable Machine
async function loadModel() {
    const modelURL = "YOUR_MODEL_URL/model.json";
    const metadataURL = "YOUR_MODEL_URL/metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();
}

// Analyser l'image avec le modèle
async function analyzeImage() {
    const fileInput = document.getElementById("imageUpload");
    if (!fileInput.files[0]) {
        alert("Veuillez charger une image");
        return;
    }
    const image = document.createElement("img");
    image.src = URL.createObjectURL(fileInput.files[0]);
    image.onload = async () => {
        const prediction = await model.predict(image, false);
        displayResult(prediction);
    };
}

// Afficher les résultats et recommander un produit
function displayResult(predictions) {
    const resultDiv = document.getElementById("result");
    const recommendationDiv = document.getElementById("recommendation");
    resultDiv.innerHTML = "";
    recommendationDiv.innerHTML = "";

    // Trouver la prédiction avec la plus haute probabilité
    let highestPrediction = predictions[0];
    for (let i = 1; i < predictions.length; i++) {
        if (predictions[i].probability > highestPrediction.probability) {
            highestPrediction = predictions[i];
        }
    }

    // Afficher le résultat
    resultDiv.innerHTML = `Diagnostic : ${highestPrediction.className} (${Math.round(highestPrediction.probability * 100)}%)`;

    // Recommander un produit basé sur le diagnostic
    let recommendation;
    if (highestPrediction.className === "Cheveux secs") {
        recommendation = "Nous vous recommandons le lait capillaire hydratant Mlle Akoueka pour restaurer l'hydratation.";
    } else if (highestPrediction.className === "Cuir chevelu gras") {
        recommendation = "Essayez le shampooing au savon noir pour un nettoyage en douceur.";
    } else if (highestPrediction.className === "Pointes fourchues") {
        recommendation = "Utilisez l’huile pousse cheveux pour nourrir vos pointes et limiter la casse.";
    } else {
        recommendation = "Essayez la gamme complète de Mlle Akoueka pour un soin complet et adapté.";
    }
    recommendationDiv.innerHTML = recommendation;
}

// Charger le modèle au démarrage
window.onload = loadModel;
