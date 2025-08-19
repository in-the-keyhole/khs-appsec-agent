
import 'dotenv/config';
import { Agent, run } from '@openai/agents';
import { loadFiles } from './filestore.js';
import { appendFile } from 'fs/promises';
import { z } from 'zod';


let files = loadFiles('./src/');

const vulernabilityAgent = new Agent({
    name: 'Software Developer Assistant',
    instructions: 'You are a helpful software application security analyst assistant format return data with this javascript JSON structure [{id, title, description }] ',
    outputType: z.object({
        content: z.string()
  })
   
});

const owasp = await run(
    vulernabilityAgent,
    'Return all published application security vunerabilities',
    

);

//let json = owasp.finalOutput.replace(/```/g, '');
let json = owasp.finalOutput.content.replace(/\n/g, '');

let vunerabilities = JSON.parse(json);


const instructionAgent = new Agent({
    name: 'Software Developer Assistant',
    instructions: 'You are a helpful software application security analyst assistant find vunerabilities in code',
});

const write =
    async (data) => {

        // Get the current date
        const currentDate = new Date();

        // Format the date as yyyy-mm-dd
        const formattedDate = currentDate.toISOString().slice(0, 10);

        const fileName = `./reports/owasp_report_${formattedDate}.md`;

        try {
            if (data) {
                await appendFile(fileName, data);
                console.log("File has been written!");
            }
        } catch (err) {
            console.error(err);
        }
    };


let output = "";

console.log("Analysing (" + vunerabilities.length + ") OWASP Vunerabilities...");
vunerabilities.forEach((value) => {

    console.log("Analysing->" + value.id);
    files.forEach(async (contents, file) => {


        const instructions = await run(
            instructionAgent,
            'Find ' + value.title + ' vunerabilites in this source code file ' + file + ': ' + contents,
        );

        //   console.log(instructions.finalOutput);
        output += instructions.finalOutput;
        // console.log(output);
        write(output);


    });


});






