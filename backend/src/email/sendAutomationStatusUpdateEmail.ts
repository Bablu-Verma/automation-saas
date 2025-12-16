import { email_transporter, sender_email } from "../lib/nodemailer";

export const sendAutomationStatusUpdateEmail = async (
  email: string,
  username: string,
  instanceName: string,
  newStatus: string
) => {
  try {
    // Status configuration
    const statusConfig: { [key: string]: { color: string, icon: string, title: string, isAdmin: boolean } } = {
      'ACTIVE': {
        color: '#27ae60',
        icon: '🟢',
        title: 'Automation Service Activated',
        isAdmin: false
      },
      'EXPIRED': {
        color: '#e74c3c',
        icon: '❌',
        title: 'Automation Service Expired',
        isAdmin: true
      },
      'EXPIRE_SOON': {
        color: '#f39c12',
        icon: '⏰',
        title: 'Automation Service Expiring Soon',
        isAdmin: true
      },
      'CONTACT_SUPPORT': {
        color: '#3498db',
        icon: '📞',
        title: 'Contact Support Required',
        isAdmin: true
      }
    };

    const config = statusConfig[newStatus.toUpperCase()] || {
      color: '#131D4F',
      icon: '📄',
      title: 'Automation Status Updated',
      isAdmin: false
    };

    const isAdminInitiated = config.isAdmin;

    const subject = `${config.icon} Automation "${instanceName}" - ${newStatus.replace('_', ' ')}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Automation Status -  Taskzeno</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8f9fa;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 0 auto;">
        <!-- Header -->
        <tr>
            <td align="center" bgcolor="#131D4F" style="padding: 30px 20px; border-radius: 10px 10px 0 0;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold;">
                                Task<span style="color: #E6521F;">Zeno</span>
                            </h1>
                            <p style="color: #E6521F; font-size: 16px; margin: 8px 0 0 0; font-weight: 500;">
                                ${isAdminInitiated ? 'Admin Service Update' : 'Service Status Update'}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Main Content -->
        <tr>
            <td bgcolor="#ffffff" style="padding: 40px 30px 30px 30px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <!-- Status Icon -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <div style="background-color: ${config.color}; width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 40px;">${config.icon}</span>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Title -->
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <h2 style="color: #131D4F; margin: 0; font-size: 24px;">
                                ${config.title}
                            </h2>
                        </td>
                    </tr>
                    
                    <!-- Greeting -->
                    <tr>
                        <td style="padding-bottom: 20px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0;">
                                Hello <strong style="color: #E6521F;">${username}</strong>,
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Status Specific Message -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <p style="color: #131D4F; font-size: 16px; line-height: 1.6; margin: 0;">
                                ${getStatusMessage(newStatus, instanceName)}
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Service Details Card -->
                    <tr>
                        <td style="padding-bottom: 30px;">
                            <div style="background-color: #f8f9fa; padding: 25px; border-radius: 8px; border-left: 4px solid ${config.color}; border: 1px solid #e9ecef;">
                                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                    <tr>
                                        <td width="40%" style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Service Name:</td>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px; font-weight: 600;">${instanceName}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Current Status:</td>
                                        <td style="padding: 12px 0;">
                                            <span style="background-color: ${config.color}; color: white; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; display: inline-block;">
                                                ${newStatus.replace('_', ' ').toUpperCase()}
                                            </span>
                                        </td>
                                    </tr>
                                    ${isAdminInitiated ? `
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Updated By:</td>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px;">taskzeno Admin Team</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 12px 0; color: #131D4F; font-weight: bold; font-size: 14px;">Updated On:</td>
                                        <td style="padding: 12px 0; color: #131D4F; font-size: 14px;">${new Date().toLocaleString()}</td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Status Information -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #fff9f7; padding: 20px; border-radius: 8px; border: 1px solid #E6521F;">
                                <h3 style="color: #E6521F; margin: 0 0 15px 0; font-size: 16px;">${getInfoTitle(newStatus)}</h3>
                                <ul style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    ${getStatusInfo(newStatus)}
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Action Required -->
                    <tr>
                        <td style="padding-bottom: 25px;">
                            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border: 1px solid #e9ecef;">
                                <h3 style="color: #131D4F; margin: 0 0 15px 0; font-size: 16px;">${getActionTitle(newStatus)}</h3>
                                <ul style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0; padding-left: 20px;">
                                    ${getActionItems(newStatus)}
                                </ul>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA Buttons -->
                    <tr>
                        <td align="center" style="padding-bottom: 25px;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center">
                                        ${getCTAButtons(newStatus)}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Security Notice -->
                    <tr>
                        <td style="padding-bottom: 10px;">
                            <div style="background-color: #fff9f7; padding: 15px; border-radius: 6px; border-left: 4px solid ${isAdminInitiated ? '#e74c3c' : '#3498db'};">
                                <p style="color: #131D4F; font-size: 14px; line-height: 1.6; margin: 0;">
                                    <strong>${isAdminInitiated ? '🔒 Admin Action Notice:' : '💡 Need Help?'}</strong> 
                                    ${isAdminInitiated 
                                      ? 'This status change was initiated by our admin team.' 
                                      : 'If you have questions about this status change, contact our support team.'
                                    }
                                </p>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td bgcolor="#131D4F" style="padding: 30px 20px; border-radius: 0 0 10px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <p style="color: #ffffff; font-size: 16px; margin: 0 0 15px 0; font-weight: bold;">
                               Taskzeno Automation Platform
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 20px;">
                            <a href="https://taskzeno.babluverma.site/" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Home</a>
                            
                            <a href="https://taskzeno.babluverma.site/contact" style="color: #E6521F; text-decoration: none; margin: 0 12px; font-size: 14px;">Support</a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center" style="padding-bottom: 15px;">
                            <p style="color: #bdc3c7; font-size: 12px; margin: 0 0 10px 0;">
                                Email: <a href="mailto:taskzeno@gmail.com" style="color: #E6521F; text-decoration: none;">taskzeno@gmail.com</a> | 
                                Website: <a href="https://taskzeno.babluverma.site/" style="color: #E6521F; text-decoration: none;">taskzeno.babluverma.site</a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td align="center">
                            <p style="color: #bdc3c7; font-size: 11px; margin: 0 0 8px 0;">
                                &copy; 2024 taskzeno Automation. All rights reserved.
                            </p>
                            <p style="color: #bdc3c7; font-size: 11px; margin: 0;">
                                <a href="https://taskzeno.babluverma.site/terms" style="color: #E6521F; text-decoration: none; margin: 0 8px;">Terms of Service</a>
                                <span style="color: #E6521F;">|</span>
                                <a href="https://taskzeno.babluverma.site/privacy" style="color: #E6521F; text-decoration: none; margin: 0 8px;">Privacy Policy</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    // Helper functions for dynamic content
    function getStatusMessage(status: string, instanceName: string): string {
        const messages: { [key: string]: string } = {
            'ACTIVE': `Your automation service <strong>"${instanceName}"</strong> is now <strong>active and running</strong>. You can start using it immediately.`,
            'EXPIRED': `Your automation service <strong>"${instanceName}"</strong> has been <strong>expired</strong> by our admin team. Service has been temporarily suspended.`,
            'EXPIRE_SOON': `Your automation service <strong>"${instanceName}"</strong> will <strong>expire soon</strong>. Please take necessary action to avoid service interruption.`,
            'CONTACT_SUPPORT': `Our admin team requires you to <strong>contact support</strong> regarding your automation service <strong>"${instanceName}"</strong>. This is mandatory for continued service.`
        };
        
        return messages[status.toUpperCase()] || `The status of your automation service "${instanceName}" has been updated to "${status}".`;
    }

    function getInfoTitle(status: string): string {
        const titles: { [key: string]: string } = {
            'ACTIVE': '✅ Service Now Active',
            'EXPIRED': '🚨 Service Expired',
            'EXPIRE_SOON': '⏰ Service Expiring Soon',
            'CONTACT_SUPPORT': '📞 Immediate Action Required'
        };
        
        return titles[status.toUpperCase()] || '📊 Status Information';
    }

    function getStatusInfo(status: string): string {
        const info: { [key: string]: string } = {
            'ACTIVE': '<li>Your automation service is now fully operational</li><li>All features are available for use</li><li>Monitor performance from your dashboard</li><li>Contact support if you encounter any issues</li>',
            'EXPIRED': '<li>Your automation service has been suspended</li><li>All automated processes have been stopped</li><li>No new tasks will be processed</li><li>Contact support to reactivate service</li>',
            'EXPIRE_SOON': '<li>Your service subscription is nearing expiration</li><li>Service will be suspended if not renewed</li><li>Renew now to avoid interruption</li><li>Check your subscription details</li>',
            'CONTACT_SUPPORT': '<li>Immediate contact with support is required</li><li>This may be for verification purposes</li><li>Or to resolve service-related issues</li><li>Failure to contact may affect service</li>'
        };
        
        return info[status.toUpperCase()] || '<li>Status update has been applied to your service</li><li>Check your dashboard for detailed information</li>';
    }

    function getActionTitle(status: string): string {
        const titles: { [key: string]: string } = {
            'ACTIVE': '🚀 Next Steps',
            'EXPIRED': '🔄 Reactivation Required',
            'EXPIRE_SOON': '💳 Renewal Required',
            'CONTACT_SUPPORT': '📞 Required Actions'
        };
        
        return titles[status.toUpperCase()] || '📋 Recommended Actions';
    }

    function getActionItems(status: string): string {
        const actions: { [key: string]: string } = {
            'ACTIVE': '<li>Start using your automation service</li><li>Test all features and integrations</li><li>Monitor service performance</li><li>Contact support if you need assistance</li>',
            'EXPIRED': '<li>Contact support to understand expiration reason</li><li>Complete any required verification steps</li><li>Follow reactivation process</li><li>Update payment method if needed</li>',
            'EXPIRE_SOON': '<li>Renew your service subscription</li><li>Update billing information if required</li><li>Contact support for renewal assistance</li><li>Review service usage and needs</li>',
            'CONTACT_SUPPORT': '<li>Contact our support team immediately</li><li>Be ready to provide service details</li><li>Follow instructions from support staff</li><li>Complete any required verification</li>'
        };
        
        return actions[status.toUpperCase()] || '<li>Review service status in dashboard</li><li>Check recent activity logs</li><li>Contact support for clarification</li>';
    }

    function getCTAButtons(status: string): string {
        const statusUpper = status.toUpperCase();
        
        if (statusUpper === 'EXPIRED') {
            return `
                <a href="https://taskzeno.babluverma.site/contact" 
                   style="background-color: #E6521F; color: white; padding: 14px 32px; 
                          text-decoration: none; border-radius: 6px; font-weight: bold; 
                          font-size: 15px; display: inline-block; margin: 5px;">
                    Contact Support
                </a>
                <a href="https://taskzeno.babluverma.site/dashboard" 
                   style="background-color: #131D4F; color: white; padding: 14px 32px; 
                          text-decoration: none; border-radius: 6px; font-weight: bold; 
                          font-size: 15px; display: inline-block; margin: 5px;">
                    View Dashboard
                </a>
            `;
        } else if (statusUpper === 'EXPIRE_SOON') {
            return `
               
                <a href="https://taskzeno.babluverma.site/contact" 
                   style="background-color: #131D4F; color: white; padding: 14px 32px; 
                          text-decoration: none; border-radius: 6px; font-weight: bold; 
                          font-size: 15px; display: inline-block; margin: 5px;">
                    Get Help
                </a>
            `;
        } else if (statusUpper === 'CONTACT_SUPPORT') {
            return `
                <a href="https://taskzeno.babluverma.site/contact" 
                   style="background-color: #e74c3c; color: white; padding: 14px 32px; 
                          text-decoration: none; border-radius: 6px; font-weight: bold; 
                          font-size: 15px; display: inline-block; margin: 5px;">
                    Contact Support Now
                </a>
                <a href="https://taskzeno.babluverma.site/dashboard" 
                   style="background-color: #131D4F; color: white; padding: 14px 32px; 
                          text-decoration: none; border-radius: 6px; font-weight: bold; 
                          font-size: 15px; display: inline-block; margin: 5px;">
                    View Service
                </a>
            `;
        } else {
            return `
                <a href="https://taskzeno.babluverma.site/dashboard/services" 
                   style="background-color: #E6521F; color: white; padding: 14px 32px; 
                          text-decoration: none; border-radius: 6px; font-weight: bold; 
                          font-size: 15px; display: inline-block; margin: 5px;">
                    View Service
                </a>
                <a href="https://taskzeno.babluverma.site/dashboard" 
                   style="background-color: #131D4F; color: white; padding: 14px 32px; 
                          text-decoration: none; border-radius: 6px; font-weight: bold; 
                          font-size: 15px; display: inline-block; margin: 5px;">
                    Go to Dashboard
                </a>
            `;
        }
    }

  
    const info = await email_transporter.sendMail({
      from: `taskzeno Services <${sender_email}>`,
      to: email,
      subject,
      html
    });

    console.log(`Automation status update email sent to ${email} for status ${newStatus}`);
    return info;
  } catch (error) {
    console.error("Error sending automation status update email:", error);
    throw error;
  }
};