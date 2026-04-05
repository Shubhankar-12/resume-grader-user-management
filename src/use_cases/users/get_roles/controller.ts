import { Request, Response } from 'express';

class GetRolesController {
  async execute(req: Request, res: Response): Promise<void> {
    const roles = [
      'Frontend Developer', 'Backend Developer', 'Fullstack Developer',
      'Software Engineer', 'Mobile Developer', 'Android Developer',
      'iOS Developer', 'Web Developer', 'Game Developer',
      'Data Scientist', 'Data Engineer', 'Machine Learning Engineer',
      'Data Analyst', 'Business Intelligence Developer',
      'Computer Vision Engineer', 'NLP Engineer',
      'DevOps Engineer', 'Site Reliability Engineer', 'Cloud Engineer',
      'Security Engineer', 'Network Engineer', 'Systems Administrator',
      'QA Engineer', 'Product Manager', 'UX Designer',
      'Technical Product Manager',
      'Solutions Architect', 'Enterprise Architect',
      'Security Architect', 'Cloud Architect',
      'Engineering Manager', 'Technical Lead', 'CTO',
      'VP of Engineering', 'Director of Engineering',
      'Blockchain Developer', 'Embedded Systems Engineer',
      'Robotics Engineer', 'AR/VR Developer', 'Graphics Programmer',
      'Quantum Computing Engineer',
      'Database Administrator', 'Database Engineer', 'Data Architect',
      'AI Research Scientist', 'MLOps Engineer',
      'Reinforcement Learning Engineer',
      'Technical Writer', 'Developer Advocate', 'Developer Relations',
      'Sales Engineer',
    ];

    res.status(200).json({ status: 200, body: { roles } });
  }
}

const getRolesController = new GetRolesController();
export { getRolesController };
