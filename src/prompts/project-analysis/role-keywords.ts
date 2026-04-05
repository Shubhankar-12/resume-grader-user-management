/**
 * Helper function to get role-specific keywords based on job title
 */
export function getRoleKeywords(role: string): string {
  const roleLower = role.toLowerCase();

  const keywordMap: Record<string, string> = {
    // Development Roles
    'frontend developer':
      'UI/UX implementation, responsive design, component architecture, state management, performance optimization, accessibility, CSS frameworks, frontend testing, bundling tools, animation',
    'backend developer':
      'API design, database optimization, microservices, security, scalability, performance tuning, caching strategies, queue management, logging, authentication',
    'fullstack developer':
      'end-to-end implementation, full application lifecycle, cross-stack optimization, system architecture, API integration, database design, UI/UX, testing strategies, deployment pipelines',
    'software engineer':
      'software architecture, system design, algorithm optimization, testing strategy, technical documentation, code quality, design patterns, performance analysis, scalability solutions',
    'mobile developer':
      'native app development, cross-platform solutions, mobile UI/UX, performance optimization, offline capabilities, app store deployment, push notifications, mobile-specific APIs, responsive layouts',
    'android developer':
      'Java/Kotlin development, Android SDK, material design, app lifecycle management, background processing, UI performance, Play Store deployment, device compatibility',
    'ios developer':
      'Swift/Objective-C, UIKit/SwiftUI, Core Data, app lifecycle, performance optimization, App Store guidelines, TestFlight, Apple design principles',
    'web developer':
      'responsive web design, browser compatibility, progressive enhancement, web performance, SEO optimization, accessibility standards, modern web APIs, HTML/CSS/JavaScript mastery',
    'game developer':
      'game engine expertise, 3D modeling integration, physics simulation, game performance optimization, animation, shader programming, multiplayer implementation, game UI/UX',

    // Data Roles
    'data scientist':
      'data analysis, machine learning models, statistical analysis, data visualization, predictive modeling, hypothesis testing, feature engineering, A/B testing, experiment design',
    'data engineer':
      'data pipeline architecture, ETL processes, data warehousing, distributed computing, data cleaning, schema design, data governance, real-time processing, data integration',
    'machine learning engineer':
      'model development, ML pipelines, algorithm optimization, feature engineering, model deployment, MLOps, experiment tracking, hyperparameter tuning, model monitoring',
    'data analyst':
      'data visualization, SQL expertise, statistical analysis, business intelligence tools, dashboard creation, metric definition, data cleaning, reporting automation, insight generation',
    'business intelligence developer':
      'dashboard development, KPI monitoring, data storytelling, ETL processes, SQL optimization, data modeling, report automation, business metrics, executive reporting',
    'computer vision engineer':
      'image processing algorithms, neural network architectures, feature extraction, model optimization, video analysis, object detection, segmentation, tracking systems',
    'nlp engineer':
      'text processing, sentiment analysis, language models, entity recognition, text classification, information extraction, document understanding, conversational AI',

    // Infrastructure Roles
    'devops engineer':
      'CI/CD pipelines, infrastructure as code, container orchestration, monitoring, security automation, configuration management, cloud services, automated testing, deployment strategies',
    'site reliability engineer':
      'system reliability, incident response, scalability planning, performance optimization, observability, automated recovery, service level objectives, capacity planning',
    'cloud engineer':
      'multi-cloud architecture, serverless computing, cloud security, cost optimization, resource management, cloud migration, high availability design, disaster recovery',
    'security engineer':
      'threat modeling, security testing, vulnerability management, incident response, security architecture, authentication systems, encryption implementation, compliance frameworks',
    'network engineer':
      'network architecture, protocol implementation, traffic optimization, network security, load balancing, routing algorithms, failover systems, latency minimization',
    'systems administrator':
      'server management, user administration, backup systems, OS optimization, automation scripting, security patching, resource monitoring, troubleshooting, disaster recovery',

    // Product Development Roles
    'qa engineer':
      'test automation, test case design, regression testing, performance testing, bug reporting, quality metrics, CI integration, test coverage analysis, user acceptance testing',
    'product manager':
      'feature prioritization, user research, product roadmap, market analysis, stakeholder management, requirement specification, user stories, product metrics, launch planning',
    'ux designer':
      'user research, usability testing, wireframing, prototyping, information architecture, user flows, accessibility standards, visual design principles, interaction design',
    'technical product manager':
      'technical roadmapping, feature specification, cross-team collaboration, technical debt management, API planning, system architecture, product metrics, release planning',

    // Architecture Roles
    'solutions architect':
      'enterprise architecture, technology stack selection, integration design, scalability planning, technical documentation, stakeholder management, best practices, cost optimization',
    'enterprise architect':
      'technology standardization, business-IT alignment, system integration, architectural governance, technology roadmap, legacy modernization, compliance architecture',
    'security architect':
      'security framework design, threat modeling, risk assessment, compliance architecture, zero-trust implementation, authentication/authorization design, security governance',
    'cloud architect':
      'multi-cloud strategy, migration architecture, cloud-native design, security controls, cost optimization, performance architecture, disaster recovery planning',

    // Leadership Roles
    'engineering manager':
      'team leadership, technical mentorship, project planning, performance management, hiring, process improvement, cross-team collaboration, delivery management',
    'technical lead':
      'technical direction, architecture decisions, code quality standards, mentoring, technical debt management, code reviews, technology selection, implementation strategies',
    'cto': 'technology strategy, technical vision, architecture oversight, technology stack decisions, innovation leadership, technical team building, executive communication, digital transformation',
    'vp of engineering':
      'engineering organization, delivery frameworks, technical leadership, team structure, hiring strategy, technology roadmap, cross-department collaboration, resource planning',
    'director of engineering':
      'department management, technical strategy, team growth, delivery predictability, engineering culture, cross-functional leadership, resource allocation',

    // Specialized Development Roles
    'blockchain developer':
      'smart contract development, consensus mechanisms, cryptographic implementations, decentralized applications, token economics, blockchain security, web3 integration',
    'embedded systems engineer':
      'firmware development, hardware interfaces, real-time operating systems, power optimization, device drivers, sensor integration, memory management',
    'robotics engineer':
      'motion planning, sensor integration, control systems, hardware interfaces, real-time processing, simulator development, robotic operating system, calibration systems',
    'ar/vr developer':
      '3D rendering, spatial computing, gesture recognition, immersive UI/UX, performance optimization, 3D asset integration, physics simulation, tracking systems',
    'graphics programmer':
      'rendering pipelines, shader development, 3D mathematics, optimization techniques, physics simulation, graphics APIs, visual effects, animation systems',
    'quantum computing engineer':
      'quantum algorithms, quantum circuit design, qubit manipulation, quantum simulation, error correction, quantum-classical integration, quantum advantage analysis',

    // Database Roles
    'database administrator':
      'database optimization, query performance, backup strategies, high availability configuration, data security, schema design, migration planning, monitoring setup',
    'database engineer':
      'database architecture, query optimization, indexing strategies, data modeling, sharding implementation, replication setup, database security, scaling solutions',
    'data architect':
      'enterprise data modeling, data governance, master data management, data integration, warehouse architecture, data quality frameworks, metadata management',

    // AI/ML Roles
    'ai research scientist':
      'algorithm development, research papers, experimental design, model innovation, baseline comparison, literature review, theoretical frameworks, proof-of-concept implementation',
    'mlops engineer':
      'ML pipeline automation, model deployment, monitoring systems, feature store implementation, experiment tracking, model versioning, infrastructure scaling, CI/CD for ML',
    'reinforcement learning engineer':
      'policy optimization, environment modeling, reward function design, multi-agent systems, simulation integration, RL algorithm implementation, state representation',

    // Other Technical Roles
    'technical writer':
      'documentation strategy, API documentation, user guides, technical tutorials, information architecture, content standards, documentation testing, audience analysis',
    'developer advocate':
      'technical content creation, community engagement, sample application development, technical presentations, API feedback collection, developer experience improvement',
    'developer relations':
      'technical community building, developer feedback collection, technical content strategy, platform evangelism, partnership programs, technical workshops, API advocacy',
    'sales engineer':
      'technical demonstrations, solution architecture, customer requirements mapping, technical objection handling, proof-of-concept development, integration planning',
  };

  // Find the closest matching role or return a generic set of keywords
  for (const [key, value] of Object.entries(keywordMap)) {
    if (roleLower.includes(key) || key.includes(roleLower)) {
      return value;
    }
  }

  return 'code quality, technical documentation, problem-solving, system design, scalability, performance optimization';
}
