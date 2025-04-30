/**
 * @swagger
 * /notifications/list:
 *   get:
 *     summary: Retrieve a list of notifications
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: skip
 *         schema:
 *           type: string
 *         description: The number of documents to skip.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: string
 *         description: The maximum number of documents to return.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: A search term to filter notifications.
 *       - in: query
 *         name: employee_id
 *         schema:
 *           type: string
 *         description: The ID of the employee to filter notifications.
 *     responses:
 *       '200':
 *         description: A list of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   description: Indicates whether the request was successful.
 *                   example: true
 *                 meta:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       description: A message describing the result of the request.
 *                       example: ""
 *                     total_documents:
 *                       type: integer
 *                       description: The total number of documents.
 *                       example: 2
 *                 statusCode:
 *                   type: integer
 *                   description: The HTTP status code of the response.
 *                   example: 200
 *                 errors:
 *                   type: ["null", "array"]
 *                   description: Any errors that occurred during the request, if applicable.
 *                   example: null
 *                 body:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: string
 *                         description: The status of the notification.
 *                         example: "ENABLED"
 *                       employee_id:
 *                         type: string
 *                         description: The ID of the employee receiving the notification.
 *                         example: "66600e0bc26d443c42ec6fd7"
 *                       foreign_type:
 *                         type: string
 *                         description: The type of the foreign entity related to the notification.
 *                         example: "task_id"
 *                       foreign_id:
 *                         type: string
 *                         description: The ID of the foreign entity related to the notification.
 *                         example: "666150859d77ba85409e67a0"
 *                       title:
 *                         type: string
 *                         description: The title of the notification.
 *                         example: "New Task Assigned"
 *                       message:
 *                         type: string
 *                         description: The message content of the notification.
 *                         example: "A new task has been assigned to you. Please review the details in the task management system."
 *                       type:
 *                         type: string
 *                         description: The type of the notification (e.g., info, warning, etc.).
 *                         example: "warning"
 *                       notification_status:
 *                         type: string
 *                         description: The status of the notification (e.g., READ, UNREAD).
 *                         example: "UNREAD"
 *                       createdon:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the notification was created.
 *                         example: "2024-07-08T09:04:03.841Z"
 *                       updatedon:
 *                         type: string
 *                         format: date-time
 *                         description: The date and time when the notification was last updated.
 *                         example: "2024-07-08T09:04:03.841Z"
 *                       notification_id:
 *                         type: string
 *                         description: The ID of the notification.
 *                         example: "668bab8341982937512d559e"
 *             example:
 *               isSuccess: true
 *               meta:
 *                 message: ""
 *                 total_documents: 2
 *               statusCode: 200
 *               errors: null
 *               body:
 *                 - status: "ENABLED"
 *                   employee_id: "66600e0bc26d443c42ec6fd7"
 *                   foreign_type: "task_id"
 *                   foreign_id: "666150859d77ba85409e67a0"
 *                   title: "New Task Assigned"
 *                   message: "A new task has been assigned to you. Please review the details in the task management system."
 *                   type: "warning"
 *                   notification_status: "UNREAD"
 *                   createdon: "2024-07-08T09:04:03.841Z"
 *                   updatedon: "2024-07-08T09:04:03.841Z"
 *                   notification_id: "668bab8341982937512d559e"
 *                 - status: "ENABLED"
 *                   employee_id: "66600e0bc26d443c42ec6fd3"
 *                   foreign_type: "lead"
 *                   foreign_id: "66614fdd9d77ba85409e6765"
 *                   title: "New Lead Assigned"
 *                   message: "You have been assigned a new lead. Please check the CRM for more details."
 *                   type: "info"
 *                   notification_status: "UNREAD"
 *                   createdon: "2024-07-08T09:02:05.198Z"
 *                   updatedon: "2024-07-08T09:02:05.198Z"
 *                   notification_id: "668bab0d41982937512d559a"
 */
