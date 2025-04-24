export const generateSlackPayload = (
  moduleName: string,
  userDetails: {
    first_name: string;
    last_name: string;
    email: string;
    organization: {
      name: string;
    };
  },
  error: string
) => {
  //   const dateObject = new Date(datetime);

  //   const formattedDate = dateObject.toLocaleString('en-US', {
  //     day: 'numeric',
  //     month: 'long',
  //     year: 'numeric',
  //     hour: 'numeric',
  //     minute: 'numeric',
  //     hour12: true,
  //     timeZone: 'IST'
  //   });

  const userText = `*User Details:*\n\nName: ${userDetails?.first_name} ${userDetails?.last_name}\nEmail Address: ${userDetails?.email}\nOrganization: ${userDetails?.organization?.name}`;

  const errorText = `*Crash Log:*\n\n\`\`\`${error}\`\`\``;

  const section = `*${moduleName}*`;

  return JSON.stringify({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Tessact App has crashed*'
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: userText
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: errorText
        }
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: section
        }
      },
      {
        type: 'divider'
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: '*Link to crashed page*'
        }
      }
    ]
  });
}; 
