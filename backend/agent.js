/**
 * Incident Assignment Update Agent
 * 
 * This agent automatically finds and updates incidents with empty assignment groups
 * Updates their work notes with: "We are going to update Assignment group as 'Incident Management'"
 */

module.exports = {
  /**
   * Main agent function to update incident work notes
   * @param {axios instance} serviceNowAPI - Configured ServiceNow API client
   * @returns {Promise<Object>} - Agent execution result
   */
  async executeUpdateAgent(serviceNowAPI) {
    const UPDATE_MESSAGE = "We are going to update Assignment group as 'Incident Management'";
    const startTime = Date.now();
    
    try {
      console.log('🤖 [AGENT] Starting Incident Assignment Update Process...');
      console.log(`⏰ [AGENT] Execution started at: ${new Date().toISOString()}`);
      
      // Step 1: Fetch incidents with empty assignment group
      console.log('\n📋 [STEP 1] Fetching incidents with empty assignment group...');
      const getResponse = await serviceNowAPI.get('', {
        params: {
          sysparm_limit: 5000,
          sysparm_query: 'assignment_groupISEMPTY'
        }
      });
      
      const incidents = getResponse.data.result;
      console.log(`✓ Found ${incidents.length} incidents with empty assignment groups`);
      
      if (incidents.length === 0) {
        console.log('✅ [AGENT] No incidents to update. Task completed.');
        return this.createSuccessResponse(0, 0, 0, [], startTime);
      }
      
      // Step 2: Prepare incidents for update
      console.log(`\n📊 [STEP 2] Preparing ${incidents.length} incidents for update...`);
      
      const updatedIncidents = [];
      const failedIncidents = [];
      
      // Step 3: Update each incident
      console.log(`\n🔄 [STEP 3] Updating work notes (${incidents.length} incidents)...`);
      console.log('━'.repeat(70));
      
      for (let i = 0; i < incidents.length; i++) {
        const incident = incidents[i];
        const progress = `[${i + 1}/${incidents.length}]`.padEnd(10);
        
        try {
          const sysId = incident.sys_id;
          const incidentNumber = incident.number;
          
          process.stdout.write(`${progress} Updating ${incidentNumber}...`);
          
          // PATCH request to update work notes
          const updateResponse = await serviceNowAPI.patch(`/${sysId}`, {
            work_notes: UPDATE_MESSAGE
          });
          
          updatedIncidents.push({
            sys_id: sysId,
            number: incidentNumber,
            short_description: incident.short_description || 'N/A',
            priority: incident.priority || 'N/A',
            status: '✅ Successfully Updated',
            message: UPDATE_MESSAGE,
            timestamp: new Date().toISOString()
          });
          
          console.log(' ✅');
          
        } catch (error) {
          console.log(` ❌ (${error.response?.status || 'Error'})`);
          
          failedIncidents.push({
            sys_id: incident.sys_id,
            number: incident.number,
            status: '❌ Failed',
            error: error.response?.data?.error?.message || error.message,
            errorCode: error.response?.status || 'Unknown'
          });
        }
      }
      
      console.log('━'.repeat(70));
      
      // Step 4: Generate final report
      console.log(`\n📈 [STEP 4] Generating Final Report...`);
      
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      const successRate = ((updatedIncidents.length / incidents.length) * 100).toFixed(2);
      
      console.log(`✨ [AGENT] Task Completed Successfully!`);
      console.log(`├─ Total Incidents: ${incidents.length}`);
      console.log(`├─ Updated: ${updatedIncidents.length} ✅`);
      console.log(`├─ Failed: ${failedIncidents.length} ❌`);
      console.log(`├─ Success Rate: ${successRate}%`);
      console.log(`└─ Duration: ${duration}s`);
      console.log(`\n⏰ Execution completed at: ${new Date().toISOString()}\n`);
      
      return this.createSuccessResponse(
        incidents.length,
        updatedIncidents.length,
        failedIncidents.length,
        { updated: updatedIncidents, failed: failedIncidents },
        startTime
      );
      
    } catch (error) {
      const duration = ((Date.now() - startTime) / 1000).toFixed(2);
      
      console.error('\n❌ [AGENT] Fatal Error During Execution!');
      console.error(`Error: ${error.message}`);
      console.error(`Duration: ${duration}s`);
      console.error(`Timestamp: ${new Date().toISOString()}\n`);
      
      return this.createErrorResponse(error, startTime);
    }
  },

  /**
   * Create a success response object
   */
  createSuccessResponse(total, updated, failed, details, startTime) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    return {
      success: true,
      agentStatus: 'COMPLETED',
      agentName: 'Incident Assignment Update Agent',
      summary: {
        totalIncidents: total,
        updatedIncidents: updated,
        failedIncidents: failed,
        successRate: total === 0 ? '0%' : `${((updated / total) * 100).toFixed(2)}%`
      },
      message: total === 0 
        ? 'All incidents already have assignment groups assigned'
        : `Successfully updated ${updated} out of ${total} incidents`,
      data: details,
      executionTime: {
        duration: `${duration}s`,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString()
      }
    };
  },

  /**
   * Create an error response object
   */
  createErrorResponse(error, startTime) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    return {
      success: false,
      agentStatus: 'FAILED',
      agentName: 'Incident Assignment Update Agent',
      message: 'Agent encountered a fatal error while updating incidents',
      error: {
        message: error.message,
        code: error.response?.status || 'UNKNOWN',
        details: error.response?.data || {}
      },
      executionTime: {
        duration: `${duration}s`,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString()
      }
    };
  },

  /**
   * Get agent information
   */
  getAgentInfo() {
    return {
      name: 'Incident Assignment Update Agent',
      version: '1.0.0',
      purpose: 'Automatically update work notes for incidents without assignment groups',
      updateMessage: "We are going to update Assignment group as 'Incident Management'",
      features: [
        'Real-time incident fetching from ServiceNow',
        'Batch processing with progress tracking',
        'Comprehensive error handling',
        'Detailed logging and reporting',
        'Success/failure metrics',
        'Execution time tracking'
      ],
      authentication: 'ServiceNow Basic Auth (username/password)',
      endpoint: 'POST /api/incidents/update-work-notes',
      createdAt: '2026-05-24'
    };
  },

  /**
   * Generate resolution plan for top first incident
   * @param {axios instance} serviceNowAPI - Configured ServiceNow API client
   * @returns {Promise<Object>} - Agent execution result
   */
  async executeResolutionAgent(serviceNowAPI) {
    const startTime = Date.now();
    
    try {
      console.log('🤖 [RESOLUTION AGENT] Starting Resolution Plan Generation...');
      console.log(`⏰ [RESOLUTION AGENT] Execution started at: ${new Date().toISOString()}`);
      
      // Step 1: Fetch the first incident
      console.log('\n📋 [STEP 1] Fetching first incident from ServiceNow...');
      const getResponse = await serviceNowAPI.get('', {
        params: {
          sysparm_limit: 1,
          sysparm_query: 'ORDERBYDESCsys_created_on'
        }
      });
      
      const incidents = getResponse.data.result;
      
      if (!incidents || incidents.length === 0) {
        console.log('❌ [RESOLUTION AGENT] No incidents found');
        return this.createResolutionErrorResponse('No incidents found', startTime);
      }
      
      const incident = incidents[0];
      console.log(`✓ Found incident: ${incident.number}`);
      console.log(`  Title: ${incident.short_description}`);
      console.log(`  Priority: ${incident.priority}`);
      console.log(`  Category: ${incident.category}`);
      
      // Step 2: Generate resolution plan based on incident details
      console.log('\n🔧 [STEP 2] Generating resolution plan...');
      
      const resolutionPlan = this.generateResolutionPlan(incident);
      
      console.log(`✓ Resolution plan generated successfully`);
      console.log(`✓ Plan length: ${resolutionPlan.length} characters`);
      
      // Step 3: Update work notes with resolution plan
      console.log('\n📝 [STEP 3] Updating incident work notes...');
      
      try {
        const updateResponse = await serviceNowAPI.patch(`/${incident.sys_id}`, {
          work_notes: resolutionPlan
        });
        
        console.log(`✅ [RESOLUTION AGENT] Work notes updated successfully`);
        
        const duration = ((Date.now() - startTime) / 1000).toFixed(2);
        
        return {
          success: true,
          agentStatus: 'COMPLETED',
          agentName: 'Incident Resolution Plan Agent',
          incidentDetails: {
            number: incident.number,
            sys_id: incident.sys_id,
            short_description: incident.short_description,
            priority: incident.priority,
            category: incident.category,
            status: incident.state
          },
          resolutionPlan: resolutionPlan,
          updateStatus: 'Successfully updated',
          message: `Resolution plan generated and applied to incident ${incident.number}`,
          executionTime: {
            duration: `${duration}s`,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date().toISOString()
          }
        };
      } catch (updateError) {
        console.error('❌ [RESOLUTION AGENT] Failed to update work notes:', updateError.message);
        
        return {
          success: false,
          agentStatus: 'PARTIAL_FAILURE',
          agentName: 'Incident Resolution Plan Agent',
          incidentDetails: {
            number: incident.number,
            sys_id: incident.sys_id,
            short_description: incident.short_description
          },
          resolutionPlan: resolutionPlan,
          updateStatus: 'Failed to update',
          message: 'Resolution plan generated but failed to update incident',
          error: updateError.message,
          executionTime: {
            duration: `${((Date.now() - startTime) / 1000).toFixed(2)}s`,
            startTime: new Date(startTime).toISOString(),
            endTime: new Date().toISOString()
          }
        };
      }
      
    } catch (error) {
      console.error('❌ [RESOLUTION AGENT] Fatal error:', error.message);
      return this.createResolutionErrorResponse(error.message, startTime);
    }
  },

  /**
   * Generate a comprehensive resolution plan based on incident details
   * @param {Object} incident - Incident object from ServiceNow
   * @returns {String} - Detailed resolution plan
   */
  generateResolutionPlan(incident) {
    const timestamp = new Date().toISOString();
    
    let resolutionPlan = `[AUTOMATED RESOLUTION PLAN - Generated on ${timestamp}]\n\n`;
    
    resolutionPlan += `INCIDENT: ${incident.number}\n`;
    resolutionPlan += `TITLE: ${incident.short_description || 'N/A'}\n`;
    resolutionPlan += `PRIORITY: ${incident.priority || 'Medium'}\n`;
    resolutionPlan += `CATEGORY: ${incident.category || 'General'}\n`;
    resolutionPlan += `STATUS: ${incident.state || 'New'}\n\n`;
    
    resolutionPlan += `═══════════════════════════════════════════════════════════\n`;
    resolutionPlan += `RESOLUTION PLAN\n`;
    resolutionPlan += `═══════════════════════════════════════════════════════════\n\n`;
    
    // Determine resolution steps based on priority and category
    const priority = parseInt(incident.priority) || 3;
    const category = (incident.category || '').toLowerCase();
    
    if (priority === 1 || priority === 2) {
      resolutionPlan += `URGENCY: HIGH PRIORITY\n\n`;
      resolutionPlan += `1. IMMEDIATE ACTIONS:\n`;
      resolutionPlan += `   • Acknowledge and notify stakeholders immediately\n`;
      resolutionPlan += `   • Escalate to senior technical team\n`;
      resolutionPlan += `   • Begin root cause analysis\n`;
      resolutionPlan += `   • Activate incident response protocol\n\n`;
    } else {
      resolutionPlan += `URGENCY: Standard Priority\n\n`;
      resolutionPlan += `1. INITIAL ASSESSMENT:\n`;
      resolutionPlan += `   • Review incident details thoroughly\n`;
      resolutionPlan += `   • Gather additional information from requester\n`;
      resolutionPlan += `   • Check knowledge base for similar issues\n`;
      resolutionPlan += `   • Identify root cause\n\n`;
    }
    
    if (category.includes('network')) {
      resolutionPlan += `2. NETWORK ISSUE RESOLUTION:\n`;
      resolutionPlan += `   • Check network connectivity and status\n`;
      resolutionPlan += `   • Review firewall and security policies\n`;
      resolutionPlan += `   • Test DNS and routing\n`;
      resolutionPlan += `   • Verify configuration settings\n`;
      resolutionPlan += `   • Run diagnostic tools if needed\n\n`;
    } else if (category.includes('software') || category.includes('application')) {
      resolutionPlan += `2. SOFTWARE/APPLICATION ISSUE RESOLUTION:\n`;
      resolutionPlan += `   • Verify system requirements and compatibility\n`;
      resolutionPlan += `   • Check for available updates or patches\n`;
      resolutionPlan += `   • Review error logs for specific messages\n`;
      resolutionPlan += `   • Attempt troubleshooting steps:\n`;
      resolutionPlan += `     - Clear cache and temporary files\n`;
      resolutionPlan += `     - Restart service/application\n`;
      resolutionPlan += `     - Reinstall if necessary\n\n`;
    } else if (category.includes('hardware')) {
      resolutionPlan += `2. HARDWARE ISSUE RESOLUTION:\n`;
      resolutionPlan += `   • Perform hardware diagnostics\n`;
      resolutionPlan += `   • Check for physical damage or connections\n`;
      resolutionPlan += `   • Review BIOS and firmware settings\n`;
      resolutionPlan += `   • Test individual components if applicable\n`;
      resolutionPlan += `   • Consider equipment replacement if necessary\n\n`;
    } else {
      resolutionPlan += `2. GENERAL TROUBLESHOOTING:\n`;
      resolutionPlan += `   • Restart affected services/systems\n`;
      resolutionPlan += `   • Check system logs for errors\n`;
      resolutionPlan += `   • Verify all configurations are correct\n`;
      resolutionPlan += `   • Check for recent system changes\n`;
      resolutionPlan += `   • Consult relevant documentation\n\n`;
    }
    
    resolutionPlan += `3. VALIDATION & TESTING:\n`;
    resolutionPlan += `   • Test the solution with requester\n`;
    resolutionPlan += `   • Verify the issue is completely resolved\n`;
    resolutionPlan += `   • Check for any side effects or new issues\n`;
    resolutionPlan += `   • Document the solution in knowledge base\n\n`;
    
    resolutionPlan += `4. FOLLOW-UP:\n`;
    resolutionPlan += `   • Close incident if resolution confirmed\n`;
    resolutionPlan += `   • Provide documentation to requester\n`;
    resolutionPlan += `   • Schedule follow-up if needed\n`;
    resolutionPlan += `   • Update incident record with all details\n\n`;
    
    resolutionPlan += `═══════════════════════════════════════════════════════════\n`;
    resolutionPlan += `NOTES:\n`;
    resolutionPlan += `• This is an automated resolution plan generated by AI\n`;
    resolutionPlan += `• Please review and customize based on your environment\n`;
    resolutionPlan += `• Escalate if resolution steps are unclear or unavailable\n`;
    resolutionPlan += `• Contact senior support if issue persists after these steps\n`;
    
    return resolutionPlan;
  },

  /**
   * Create error response for resolution agent
   */
  createResolutionErrorResponse(error, startTime) {
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    
    return {
      success: false,
      agentStatus: 'FAILED',
      agentName: 'Incident Resolution Plan Agent',
      message: 'Failed to generate and apply resolution plan',
      error: {
        message: error,
        code: 'RESOLUTION_GENERATION_FAILED'
      },
      executionTime: {
        duration: `${duration}s`,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date().toISOString()
      }
    };
  },

  /**
   * Get agent status
   */
  getAgentStatus() {
    return {
      status: 'READY',
      health: 'OPERATIONAL',
      lastCheck: new Date().toISOString(),
      description: 'Automated agents for incident management and resolution planning',
      capabilities: [
        'Query incidents with empty assignment groups',
        'Batch update work notes via PATCH',
        'Fetch first incident and generate resolution plan',
        'Handle authentication and errors',
        'Generate detailed reports',
        'Track execution metrics'
      ]
    };
  }
};
