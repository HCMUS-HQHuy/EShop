import * as mysql from "mysql2/promise";
import type { Connection, RowDataPacket } from "mysql2/promise";

const db = {
    host: "localhost",
    user: "root",
    password: "1",
    database: "TeamRoomDocument"
};

interface TeamRoomDocument {
    document_id: number;
    teamroom_id: number;
    category_id: number;
    parent_document_id: number;
    level: number;
    title: string;
    content: string;
    created_by: number;
    created_at: Date;
    updated_at: number;
    subDocument: TeamRoomDocument[];
}

async function updateDocumentList(documentList: TeamRoomDocument[], documentId: number) {
    const connection = await mysql.createConnection(db);

    let sql = "SELECT * FROM TeamRoomDocument WHERE parent_document_id = ? AND deleted = 0 AND parent_document_id != document_id";
    if (documentId === -1) sql = "SELECT DISTINCT * FROM TeamRoomDocument WHERE level = 1 AND deleted = 0";

    const [rows] = await connection.query<RowDataPacket[]>(sql, [documentId]);
    console.log(`Found ${rows.length} sub-documents for document ID: ${documentId}`);
    if (rows.length <= 0) {
        console.log(`No sub-documents found for document ID: ${documentId}`);
        await connection.end();
        return;
    }
    for (const row of rows) {
        const subDocument: TeamRoomDocument = {
            document_id: row.document_id,
            teamroom_id: row.teamroom_id,
            category_id: row.category_id,
            level: row.level,
            title: row.title,
            content: row.content,
            created_by: row.created_by,
            created_at: row.created_at,
            updated_at: row.updated_at,
            parent_document_id: row.parent_document_id,
            subDocument: [],
        };
        await updateDocumentList(subDocument.subDocument, row.document_id);
        documentList.push(subDocument);
    }
    await connection.end();
}

async function run() {
    const documentList : TeamRoomDocument[] = [];
    await updateDocumentList(documentList, -1);
    console.log("Final document list:", JSON.stringify(documentList, null, 2));
}

run();