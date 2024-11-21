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

        // Validate solutions using back-substitution
        const eq1Check = a1 * x + b1 * y;
        const eq2Check = a2 * x + b2 * y;
        const tolerance = 1e-6; // Tolerance for floating-point errors

        processDetails += `<b>Étape 3 :</b> Validation des solutions (substitution inverse).<br>`;
        processDetails += `Pour l'équation 1: ${a1}x + ${b1}y = ${eq1Check.toFixed(2)} (attendu: ${c1})<br>`;
        processDetails += `Pour l'équation 2: ${a2}x + ${b2}y = ${eq2Check.toFixed(2)} (attendu: ${c2})<br>`;

        if (Math.abs(eq1Check - c1) > tolerance || Math.abs(eq2Check - c2) > tolerance) {
            document.getElementById("system-output").innerText =
                "Erreur : Les solutions calculées ne satisfont pas les équations d'origine.";
            processDetails += `<b>Échec :</b> Les solutions calculées ne sont pas correctes.<br>`;
        } else {
            processDetails += `<b>Validation réussie :</b> Les solutions sont correctes.<br>`;
            document.getElementById("system-output").innerHTML =
                `<b>Solution :</b> x = ${x.toFixed(2)}, y = ${y.toFixed(2)}`;
        }

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
