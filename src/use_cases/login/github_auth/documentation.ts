/**
 * @swagger
 * /employee/login/email:
 *   post:
 *     summary: Login Employee
 *     tags:
 *       - Employee
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the employee
 *                 required: true
 *                 example: admin@stylabs.in
 *               password:
 *                 type: string
 *                 description: Password of the employee
 *                 example: Admin@123
 *     responses:
 *       '200':
 *         description: Created Login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Response object for a successful creation request.
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total_documents:
 *                       type: integer
 *                       description: Total number of documents included in the response.
 *                     message:
 *                       type: string
 *                       description: A message describing the result of the request.
 *                     data_type:
 *                       type: string
 *                       description: The data type of the response.
 *                 statusCode:
 *                   type: integer
 *                   description: The HTTP status code of the response.
 *                 errors:
 *                   type: ["null", "array"]
 *                   description: Any errors that occurred during the request, if applicable.
 *                 body:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: The token of the item.
 *             example:
 *               isSuccess: true
 *               meta:
 *                 total_documents: 1
 *                 message: Created Successfully
 *                 data_type: "application/json"
 *               statusCode: 200
 *               errors: null
 *               body:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc19sb2dpbiI6ZmFsc2UsImRldmljZSI6eyJpZCI6IlVFMUEuMjMwODI5LjAzNiIsIm9uZV9zaWduYWxfaWQiOiI5MmM1MWEzMy1mNWNhLTRjN2EtYWUwYi0zZmMwOTVjZWYxN2IiLCJvc190eXBlIjoiYW5kcm9pZCJ9LCJjdXN0b21lcl9pZCI6bnVsbCwiaWF0IjoxNzA0MjkxMDc2fQ.KSebPuWm7n071qwqrpMgiQvuebMdNNUROjGZflPSVRQ"
 *       '400':
 *         description: Bad request, invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               isSuccess: false
 *               meta:
 *                 total_documents: 0
 *                 message: "Invalid Request"
 *                 error: "Bad Request"
 *                 data_type: "application/json"
 *               statusCode: 400
 *               errors:
 *                 - name: "NotFound"
 *                   code: "NotFound"
 *                   message: "name not found"
 *                   field: "name"
 *               body: null
 */
