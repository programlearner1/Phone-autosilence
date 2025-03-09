import { exec } from 'child_process';
import express from 'express';

const router = express.Router();

// Function to execute system commands to control audio
const executeCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(stdout);
    });
  });
};

// Endpoint to update device silent mode
router.post('/update-silent-mode', async (req, res) => {
  try {
    const { silent } = req.body;
    
    // Commands will vary based on the operating system
    // This example uses Windows commands
    const command = silent
      ? 'powershell.exe Set-AudioDevice -PlaybackMute $true'  // Mute
      : 'powershell.exe Set-AudioDevice -PlaybackMute $false'; // Unmute
      
    await executeCommand(command);
    
    res.json({ success: true });
  } catch (error) {
    console.error('Error updating silent mode:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router; 