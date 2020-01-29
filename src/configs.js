import robots from "./robots.csv";
import placeholder from "./placeholder.csv";

export const flatfileConfigs = [{
fields: [
    {
        label: "Band Name",
        key: "band-name",
        isRequired: true,
        description: "Band Name",
    },
    {
        label: "Song name",
        key: "song-name",
        description: "Song name",
    },
    {
        label: "Album Name",
        key: "album-name"
    },
    {
        label: "Beloved song?",
        key: "loved"
    }
],
type: "Bands/Songs",
allowInvalidSubmit: true,
managed: true,
allowCustom: false,
disableManualInput: true
},
{
    fields: [
        {
            label: "Robot Name",
            key: "name",
            isRequired: true,
            description: "The designation of the robot",
            validators: [
                {
                    validate: "required_without",
                    fields: ["id", "shield-color"],
                    error: "must be present if no id or shield color"
                }
            ]
        },
        {
            label: "Shield Color",
            key: "shield-color",
            description: "Chromatic value",
            validator: {
                validate: "regex_matches",
                regex: /^[a-zA-Z]+$/,
                error: "Not alphabet only"
            }
        },
        {
            label: "Robot Helmet Style",
            key: "helmet-style"
        },
        {
            label: "Call Sign",
            key: "sign",
            alternates: ["nickname", "wave"],
            validators: [
                {
                    validate: "regex_matches",
                    regex: /^[a-zA-Z]{4}$/,
                    error: "must be 4 characters exactly"
                },
                {
                    validate: "regex_excludes",
                    regex: /test/,
                    error: 'must not include the word "test"'
                }
            ],
            isRequired: true
        },
        {
            label: "Robot ID Code",
            key: "id",
            description: "Digital identity",
            validators: [
                {
                    validate: "regex_matches",
                    regex: "numeric",
                    error: "must be numeric"
                },
                {
                    validate: "required_without",
                    fields: ["name"],
                    error: "ID must be present if name is absent"
                }
            ]
        }
    ],
    type: "Robot",
    allowInvalidSubmit: true,
    managed: true,
    allowCustom: true,
    disableManualInput: false
}]

export const filesToUse = [robots, placeholder]

let promiseArray = []
let finalArray = []

filesToUse.forEach(file => getFile(file))

async function getFile(url) {
    var response = await fetch(url).then(response => response.text())
    promiseArray.push(response)
}

const splitCsv = (csvString) => {
    let breakOnNewline = csvString.split('\n')
    let breakOnComma = Array.from(breakOnNewline, (element => {
        return element.split(',')
    }))
    for (let i = 0; i < breakOnComma.length; i++) {
        for (let j = 0; j < breakOnComma[i].length; j++) {
            breakOnComma[i][j] = {value: breakOnComma[i][j]}
        }
    }
    return breakOnComma
}

const loopIfUnresolved = () => {
    if (promiseArray.length === 0) {
        setTimeout(loopIfUnresolved, 1500)
    } else {
        for (let i = 0; i < promiseArray.length; i++) {
            finalArray.push(splitCsv(promiseArray[i]))
        }
    }
}
loopIfUnresolved(promiseArray)

export default finalArray




