import { JSONFilePreset } from 'lowdb/node'

const defaultData = { renarrations: [] }
const db = await JSONFilePreset('db.json', defaultData)

// Read from the JSON file or initialize it
await db.read();
db.data ||= defaultData;
await db.write();
