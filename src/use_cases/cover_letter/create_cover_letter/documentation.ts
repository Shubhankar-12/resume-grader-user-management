/**
 * @swagger
 * /notifications/create:
 *   post:
 *     summary: Create a new notification
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               employee_id:
 *                 type: string
 *                 description: The ID of the employee receiving the notification.
 *               foreign_type:
 *                 type: string
 *                 description: The type of the foreign entity related to the notification.
 *               foreign_id:
 *                 type: string
 *                 description: The ID of the foreign entity related to the notification.
 *               title:
 *                 type: string
 *                 description: The title of the notification.
 *               message:
 *                 type: string
 *                 description: The message content of the notification.
 *               type:
 *                 type: string
 *                 description: The type of the notification (e.g., info, warning, etc.).
 *               read_at:
 *                 type: string
 *                 format: date-time
 *                 description: The date and time when the notification was read.
 *               notification_status:
 *                 type: string
 *                 description: The status of the notification (e.g., READ, UNREAD).
 *               status:
 *                 type: string
 *                 description: The status of the notification record.
 *             required:
 *               - employee_id
 *               - foreign_type
 *               - foreign_id
 *               - title
 *               - message
 *               - type
 *               - notification_status
 *             example:
 *               employee_id: "66600e0bc26d443c42ec6fd7"
 *               foreign_type: "task_id"
 *               foreign_id: "666150859d77ba85409e67a0"
 *               title: "New Task Assigned"
 *               message: "A new task has been assigned to you. Please review the details in the task management system."
 *               type: "warning"
 *               notification_status: "UNREAD"
 *     responses:
 *       '201':
 *         description: Notification Created Successfully
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
 *                     total_documents:
 *                       type: integer
 *                       description: The total number of documents created.
 *                       example: 1
 *                     message:
 *                       type: string
 *                       description: A message describing the result of the request.
 *                       example: "Created Successfully"
 *                     data_type:
 *                       type: string
 *                       description: The data type of the response.
 *                       example: "application/json"
 *                 statusCode:
 *                   type: integer
 *                   description: The HTTP status code of the response.
 *                   example: 201
 *                 errors:
 *                   type: ["null", "array"]
 *                   description: Any errors that occurred during the request, if applicable.
 *                   example: null
 *                 body:
 *                   type: object
 *                   properties:
 *                     notification_id:
 *                       type: string
 *                       description: The ID of the created notification.
 *                       example: "668bab8341982937512d559e"
 *                     title:
 *                       type: string
 *                       description: The title of the notification.
 *                       example: "New Task Assigned"
 *                     message:
 *                       type: string
 *                       description: The message content of the notification.
 *                       example: "A new task has been assigned to you. Please review the details in the task management system."
 *                     type:
 *                       type: string
 *                       description: The type of the notification.
 *                       example: "warning"
 *                     status:
 *                       type: string
 *                       description: The status of the notification record.
 *                       example: "ENABLED"
 *                     notification_status:
 *                       type: string
 *                       description: The status of the notification.
 *                       example: "UNREAD"
 *                     foreign_type:
 *                       type: string
 *                       description: The type of the foreign entity related to the notification.
 *                       example: "task_id"
 *                     foreign_id:
 *                       type: string
 *                       description: The ID of the foreign entity related to the notification.
 *                       example: "666150859d77ba85409e67a0"
 *                     employee_id:
 *                       type: string
 *                       description: The ID of the employee receiving the notification.
 *                       example: "66600e0bc26d443c42ec6fd7"
 *                     createdon:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the notification was created.
 *                       example: "2024-07-08T09:04:03.841Z"
 *                     updatedon:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time when the notification was last updated.
 *                       example: "2024-07-08T09:04:03.841Z"
 */
