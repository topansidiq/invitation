import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const filePath = path.join(process.cwd(), "data", "guests.json");
    const jsonData = fs.readFileSync(filePath, "utf-8");
    const guests = JSON.parse(jsonData);

    res.status(200).json(guests);
}