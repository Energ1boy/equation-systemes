function parseEquation(equation) {
    // Clean up spaces and convert to lowercase
    const cleanedEquation = equation.toLowerCase().replace(/\s+/g, "");
    // Regular expression to parse coefficients and constants
    const regex = /([+-]?\d*\.?\d*)x|([+-]?\d*\.?\d*)y|=([+-]?\d*\.?\d*)/g;
    const matches = Array.from(cleanedEquation.matchAll(regex));

    let x = 0, y = 0, c = 0;

    matches.forEach(match => {
        if (match[1] !== undefined) {
            // Coefficient of x
            x += Number(match[1] === "" || match[1] === "+" ? 1 : match[1] === "-" ? -1 : match[1]);
        } else if (match[2] !== undefined) {
            // Coefficient of y
            y += Number(match[2] === "" || match[2] === "+" ? 1 : match[2] === "-" ? -1 : match[2]);
        } else if (match[3] !== undefined) {
            // Constant term
            c = Number(match[3]);
        }
    });

    return [x, y, c];
}

function solveSystem() {
    const eq1 = document.getElementById("equation1").value;
    const eq2 = document.getElementById("equation2").value;

    try {
        const [a1, b1, c1] = parseEquation(eq1);
        const [a2, b2, c2] = parseEquation(eq2);

        // Calculate determinant
        const det = a1 * b2 - a2 * b1;

        let processDetails = `<b>Étape 1 :</b> Calcul du déterminant.<br>`;
        processDetails += `Determinant = (${a1}) * (${b2}) - (${a2}) * (${b1}) = ${det}<br>`;

        if (det === 0) {
            // Determinant is 0, no unique solution
            processDetails += `<b>Étape 2 :</b> Le déterminant est nul, donc le système n'a pas de solution unique.<br>`;
            document.getElementById("system-output").innerText =
                "Le système n'a pas de solution unique (incompatible ou indéterminé).";
            document.getElementById("process-output").innerHTML = processDetails;
            return;
        }

        // Calculate solutions
        const x = (c1 * b2 - c2 * b1) / det;
        const y = (a1 * c2 - a2 * c1) / det;

        processDetails += `<b>Étape 2 :</b> Calcul des solutions.<br>`;
        processDetails += `x = (c1 * b2 - c2 * b1) / det = (${c1} * ${b2} - ${c2} * ${b1}) / ${det} = ${x.toFixed(2)}<br>`;
        processDetails += `y = (a1 * c2 - a2 * c1) / det = (${a1} * ${c2} - ${a2} * ${c1}) / ${det} = ${y.toFixed(2)}<br>`;
        processDetails += `<b>Solution :</b> x = ${x.toFixed(2)}, y = ${y.toFixed(2)}<br>`;

        document.getElementById("system-output").innerHTML =
            `<b>Solution :</b> x = ${x.toFixed(2)}, y = ${y.toFixed(2)}`;
        document.getElementById("process-output").innerHTML = processDetails;
    } catch (error) {
        document.getElementById("system-output").innerText =
            "Erreur : Veuillez entrer des équations valides.";
    }
}

function toggleProcess() {
    const processDetails = document.getElementById("process-details");
    processDetails.classList.toggle("hidden");
    processDetails.classList.toggle("visible");

    const toggleButton = document.getElementById("toggle-process");
    toggleButton.textContent =
        processDetails.classList.contains("hidden") ? "Voir le processus" : "Masquer le processus";
}
