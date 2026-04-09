import React, { useState, useEffect } from 'react';

type Task = {
  taskSid: string;
  taskStatus: string;
  taskChannel: string;
  queueName: string;
  timestamp: string;
  customerName: string;
};

interface LatestTaskState {
  data: Task[] | null;
  loading: boolean;
  error: string | null;
}

const LatestTask: React.FC = () => {
  const [state, setState] = useState<LatestTaskState>({
    data: null,
    loading: true,
    error: null,
  });
  const fetchTasks = async () => {
    try {
      setState({ data: null, loading: true, error: null });

      const response = await fetch('http://localhost:4001');

      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }

      const tasks: Task[] | [] = await response.json();
      setState({ data: tasks, loading: false, error: null });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setState({ data: null, loading: false, error: errorMessage });
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchTasks, 5000); // Fetch tasks every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  const { data, loading, error } = state;

  // Loading state
  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading tasks...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  // Empty data state
  if (!data || data.length === 0) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
        <p>No tasks available</p>
      </div>
    );
  }

  // Success state
  return (
    <div style={{ padding: '20px' }}>
      <h2>Latest Task</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {data.map((task, index) => (
          <div key={index}>
            <div style={{ marginBottom: '8px' }}>
              <strong>Task SID:</strong> <small>{task.taskSid}</small>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Customer:</strong> {task.customerName}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Status:</strong>{' '}
              <span style={{ color: task.taskStatus === 'completed' ? 'green' : 'orange' }}>{task.taskStatus}</span>
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Channel:</strong> {task.taskChannel}
            </div>
            <div style={{ marginBottom: '8px' }}>
              <strong>Queue:</strong> {task.queueName}
            </div>
            <div>
              <strong>Timestamp:</strong> {task.timestamp}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LatestTask;
