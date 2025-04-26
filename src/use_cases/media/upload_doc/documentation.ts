/**
 * @swagger
 * /employee/upload-doc:
 *   post:
 *     summary: Upload a Doc with Employee Id and type of Doc
 *     tags:
 *       - Employee
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload
 *               employee_id:
 *                 type: string
 *                 description: Employee Id associated with the document
 *                 example: 65f7e61ea7e54a6ab9a97dc7
 *               type:
 *                 type: string
 *                 description: Type of document uploaded [CV,APPLICATION]
 *                 example: CV
 *     responses:
 *       '200':
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 meta:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Document added Successfully
 *                     total_documents:
 *                       type: integer
 *                       example: 1
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 errors:
 *                   type: null
 *                 body:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: CV
 *                     status:
 *                       type: string
 *                       example: ENABLED
 *                     _id:
 *                       type: string
 *                       example: 65f7f71e510abd9de9583c98
 *                     document_url:
 *                       type: string
 *                       example: "https://dm9w9yb2mzkxx.cloudfront.net/eyJidWNrZXQiOiJtYW56aWwtYXNzZXRzIiwia2V5IjoiZG9jL2JkZmQ5YzU0LWMzOTctNGM0MC04NWE0LTRhZTc1OTY0YjgyNy5wZGYiLCJlZGl0cyI6eyJyZXNpemUiOnsiZml0IjoiaW5zaWRlIn19fQ=="
 *                     employee_id:
 *                       type: string
 *                       example: 65f7e61ea7e54a6ab9a97dc7
 *                     created_on:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-18T08:11:10.291Z"
 *                     updated_on:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-03-18T08:11:10.291Z"
 *                     __v:
 *                       type: integer
 *                       example: 0
 *       '400':
 *         description: Bad request, invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: false
 *                 meta:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Invalid Request
 *                     total_documents:
 *                       type: integer
 *                       example: 0
 *                     error:
 *                       type: string
 *                       example: Bad Request
 *                     data_type:
 *                       type: string
 *                       example: application/json
 *                 statusCode:
 *                   type: integer
 *                   example: 400
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         example: NullOrUndefined
 *                       message:
 *                         type: string
 *                         example: The type is empty
 *                       field:
 *                         type: string
 *                         example: type
 *                 body:
 *                   type: null
 */
