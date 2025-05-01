/**
 * @swagger
 * /testimonials/:
 *   get:
 *     summary: Get testimonial by ID
 *     tags:
 *       - Testimonials
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: testimonial_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the testimonial to retrieve
 *         example: 665efb48232e678ea5edeff4
 *     responses:
 *       '200':
 *         description: Successfully retrieved testimonial
 *         content:
 *           application/json:
 *             schema:
 *               type: object
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
 *                     error:
 *                       type: string
 *                       description: Any error message associated with the request, if applicable.
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         current_page:
 *                           type: integer
 *                           description: The current page number.
 *                         next_page:
 *                           type: integer
 *                           description: The number of the next page, if available.
 *                         previous_page:
 *                           type: integer
 *                           description: The number of the previous page, if available.
 *                         limit:
 *                           type: integer
 *                           description: The limit of items per page.
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
 *                     name:
 *                       type: string
 *                       description: The name of the person giving the testimonial.
 *                     title:
 *                       type: string
 *                       description: The title or position of the person.
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                       description: An array of tags related to the testimonial.
 *                     description:
 *                       type: string
 *                       description: The content of the testimonial.
 *                     status:
 *                       type: string
 *                       description: The status of the testimonial.
 *                     testimonial_id:
 *                       type: string
 *                       description: The unique identifier for the testimonial.
 *                     createdon:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time the testimonial was created.
 *                     updatedon:
 *                       type: string
 *                       format: date-time
 *                       description: The date and time the testimonial was last updated.
 *             example:
 *               isSuccess: true
 *               meta:
 *                 total_documents: 1
 *                 message: Request Successfully
 *                 error: ""
 *                 pagination:
 *                   current_page: 0
 *                   next_page: 0
 *                   previous_page: 0
 *                   limit: 0
 *                 data_type: "application/json"
 *               statusCode: 200
 *               errors: null
 *               body:
 *                 name: "Alice Lee"
 *                 title: "Frontend Developer"
 *                 description: "Experienced frontend developer specializing in web development."
 *                 tags:
 *                   - "JavaScript"
 *                   - "React"
 *                   - "Vue.js"
 *                 status: "ENABLED"
 *                 testimonial_id: "665efb48232e678ea5edeff4"
 *                 createdon: "2024-06-04T11:32:24.566Z"
 *                 updatedon: "2024-06-04T11:32:24.566Z"
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
 *                 - name: "ValidationError"
 *                   code: "InvalidData"
 *                   message: "testimonial_id is required"
 *                   field: "testimonial_id"
 *               body: null
 */
