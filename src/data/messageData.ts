import { MessageThread } from '@/types/message';

export const mockMessageThreads: MessageThread[] = [
  {
    id: 'thread-1',
    consultantName: 'Sarah Chen',
    consultantCompany: 'Coastal Design Studio',
    role: 'Building Designer',
    task: 'Building Design',
    projectName: '001 Dennis House',
    lastMessage: 'Thanks for the details. I can provide a quote by Friday.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    unreadCount: 2,
    isFavorite: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    messages: [
      {
        id: 'msg-1',
        text: 'Hi, I received your project details for 24 Harvest Street, Thrumster. Could you clarify the timeline expectations?',
        sender: 'consultant',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
        isRead: true,
        deliveryMethod: 'email',
        attachments: [
          {
            name: 'portfolio_examples.pdf',
            size: '2.4 MB',
            type: 'application/pdf',
          },
        ],
      },
      {
        id: 'msg-2',
        text: 'Hi Sarah, we are looking to start the design phase within the next 3 weeks. The full project should be completed in 6 months.',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
        isRead: true,
        deliveryMethod: 'app',
      },
      {
        id: 'msg-3',
        text: 'Thanks for the details. I can provide a quote by Friday. I have attached some initial concept sketches based on your brief.',
        sender: 'consultant',
        timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
        isRead: false,
        deliveryMethod: 'email',
        attachments: [
          {
            name: 'concept_sketches.jpg',
            size: '1.8 MB',
            type: 'image/jpeg',
          },
          {
            name: 'quote_estimate.xlsx',
            size: '156 KB',
            type: 'application/vnd.ms-excel',
          },
        ],
      },
    ],
  },
  {
    id: 'thread-2',
    consultantName: 'Michael Thompson',
    consultantCompany: 'GeoTech Services',
    role: 'Geotechnical Engineer',
    task: 'Geotechnical Assessment',
    projectName: '001 Dennis House',
    lastMessage: 'We can schedule a site visit for next Tuesday.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    unreadCount: 1,
    isFavorite: true,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=michael',
    messages: [
      {
        id: 'msg-4',
        text: 'Hello, I have reviewed your project requirements. When would be a good time for a site visit?',
        sender: 'consultant',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        isRead: true,
        deliveryMethod: 'app',
      },
      {
        id: 'msg-5',
        text: 'Next week would work well. What days are you available?',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
        isRead: true,
        deliveryMethod: 'app',
      },
      {
        id: 'msg-6',
        text: 'We can schedule a site visit for next Tuesday. I have attached our standard site inspection checklist.',
        sender: 'consultant',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
        isRead: false,
        deliveryMethod: 'email',
        attachments: [
          {
            name: 'site_inspection_checklist.pdf',
            size: '245 KB',
            type: 'application/pdf',
          },
        ],
      },
    ],
  },
  {
    id: 'thread-3',
    consultantName: 'David Wilson',
    consultantCompany: 'Precision Survey Co',
    role: 'Surveyor',
    task: 'Land Survey',
    projectName: 'Bondi Beach Renovation',
    lastMessage: 'The survey report has been completed and sent to your email.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    unreadCount: 0,
    isFavorite: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=david',
    messages: [
      {
        id: 'msg-7',
        text: 'We have completed the land survey for your property.',
        sender: 'consultant',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
        isRead: true,
        deliveryMethod: 'app',
      },
      {
        id: 'msg-8',
        text: 'Great! When can I expect the final report?',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2.5), // 2.5 days ago
        isRead: true,
        deliveryMethod: 'app',
      },
      {
        id: 'msg-9',
        text: 'The survey report has been completed and sent to your email.',
        sender: 'consultant',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
        isRead: true,
        deliveryMethod: 'email',
        attachments: [
          {
            name: 'land_survey_report.pdf',
            size: '4.2 MB',
            type: 'application/pdf',
          },
          {
            name: 'survey_map.dwg',
            size: '1.5 MB',
            type: 'application/acad',
          },
        ],
      },
    ],
  },
  {
    id: 'thread-4',
    consultantName: 'Emma Roberts',
    consultantCompany: 'Structural Solutions',
    role: 'Structural Engineer',
    task: 'Structural Design',
    projectName: 'Byron Bay Beach House',
    lastMessage: 'I have some questions about the foundation requirements.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    unreadCount: 1,
    isFavorite: false,
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=emma',
    messages: [
      {
        id: 'msg-10',
        text: 'Hi, I am interested in working on your project. I have reviewed the initial plans.',
        sender: 'consultant',
        timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        isRead: true,
        deliveryMethod: 'app',
      },
      {
        id: 'msg-11',
        text: 'I have some questions about the foundation requirements. Please see the attached engineering assessment.',
        sender: 'consultant',
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
        isRead: false,
        deliveryMethod: 'email',
        attachments: [
          {
            name: 'foundation_assessment.pdf',
            size: '892 KB',
            type: 'application/pdf',
          },
        ],
      },
    ],
  },
];
