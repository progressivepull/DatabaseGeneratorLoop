$(function () {

    console.log("App Started.....");

    $("#generateJSONBtn").hide();

    // ===============================
    // Generate Question Input Fields
    // ===============================
    $("#generateFieldsBtn").on("click", function () {

       $("#generateJSONBtn").show();
       $("#noQuestionsInput").hide();

        const count = parseInt($("#questionCount").val());
        const $container = $("#questionsContainer");

        $container.empty();

        for (let i = 1; i <= count; i++) {

            const block = `
                <div class="question-block" data-q="${i}">
                    <h3>Question ${i}</h3>
                    <br><br>

                    <!-- Problem Description -->
                    <label>Problem Description:</label>
                    <div class="pd_container" id="pd_container_${i}">
                        <input type="text" class="pd_line" data-q="${i}">
                    </div>
                    <br>
                    <button class="btn btn-primary addPdLineBtn" data-q="${i}">+ Add Line</button><br>
                    <br>

                    <hr>

                    <!-- Question -->
                    <label>Question Text:</label>
                    <div class="q_container" id="q_container_${i}">
                        <input type="text" class="q_line" data-q="${i}">
                    </div>
                    <br>
                    <button class="btn btn-primary addQLineBtn" data-q="${i}">+ Add Line</button><br>
                    <br>

                    <hr>

                    <label>Option A:</label>
                    <input type="text" id="A_${i}">

                    <label>Option B:</label>
                    <input type="text" id="B_${i}">

                    <label>Option C:</label>
                    <input type="text" id="C_${i}">

                    <label>Option D:</label>
                    <input type="text" id="D_${i}">

                    <label>Option E:</label>
                    <input type="text" id="E_${i}">

                    <label>Correct Answer:</label>
                    <select id="ans_${i}">
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                        <option value="E">E</option>
                    </select>

                    <hr>

                    <label>Code:</label>
                    <textarea id="code_${i}" style="height:300px;"></textarea>

                    <label>Language:</label>
                    <select id="lang_${i}">
						<option value=""></option>
                        <option value="python">python</option>
                        <option value="SQL">SQL</option>
                    </select>
                </div>
            `;

            $container.append(block);
        }
    });


    // ===============================
    // Add Line Buttons (Delegated)
    // ===============================
    $(document).on("click", ".addPdLineBtn", function () {
        const q = $(this).data("q");
        $(`#pd_container_${q}`).append(`<input style="margin-top: 15px;" type="text" class="pd_line" data-q="${q}">`);
    });

    $(document).on("click", ".addQLineBtn", function () {
        const q = $(this).data("q");
        $(`#q_container_${q}`).append(`<input style="margin-top: 15px;" type="text" class="q_line" data-q="${q}">`);
    });


    // ===============================
    // Build JSON + Download
    // ===============================
    $("#generateJSONBtn").on("click", function () {

        const count = parseInt($("#questionCount").val());

        const template = {
            config: {
                version: "",
                exam_name: "",
                link_base_url: "",
                link_folder_name: "",
                link_file_name: "",
                link_terms: "",
                shuffle_questions: true,
                shuffle_options: true,
                time_limit_minutes: 60
            },
            questions: []
        };

        for (let i = 1; i <= count; i++) {

            // Collect problem_description lines
            const pdLines = [];
            $(`#pd_container_${i} .pd_line`).each(function () {
                const val = $(this).val().trim();
                if (val) pdLines.push({ line: val });
            });

            // Collect question lines
            const qLines = [];
            $(`#q_container_${i} .q_line`).each(function () {
                const val = $(this).val().trim();
                if (val) qLines.push({ line: val });
            });

            // Code lines
            const codeLines = $(`#code_${i}`).val()
                .split("\n")
                .map(l => ({ line: l }));

            template.questions.push({
                id: i,
                problem_description: pdLines,
                question: qLines,
                options: {
                    A: $(`#A_${i}`).val(),
                    B: $(`#B_${i}`).val(),
                    C: $(`#C_${i}`).val(),
                    D: $(`#D_${i}`).val(),
                    E: $(`#E_${i}`).val()
                },
                answer: $(`#ans_${i}`).val(),
                resource: {
                    code: {
                        lines: codeLines,
                        language: $(`#lang_${i}`).val()
                    }
                }
            });
        }

        const blob = new Blob(
            [JSON.stringify(template, null, 2)],
            { type: "application/json" }
        );

        const url = URL.createObjectURL(blob);

        $("<a>")
            .attr("href", url)
            .attr("download", "template.json")[0]
            .click();

        URL.revokeObjectURL(url);
    });

});