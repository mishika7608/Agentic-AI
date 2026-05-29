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
   * Get agent status
   */
  getAgentStatus() {
    return {
      status: 'READY',
      health: 'OPERATIONAL',
      lastCheck: new Date().toISOString(),
      description: 'Automated agent for updating work notes on incidents with empty assignment groups',
      capabilities: [
        'Query incidents with empty assignment groups',
        'Batch update work notes via PATCH',
        'Handle authentication and errors',
        'Generate detailed reports',
        'Track execution metrics'
      ]
    };
  }
};
