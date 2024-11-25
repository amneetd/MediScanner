/**
 * I have no idea how to actually implement notifications/reminders for apps so I still have to figure that out
 */

import React, { useState, useEffect } from 'react';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    // since I don't know how to use reminders this is how we will simulate it for now
    const storedReminders = JSON.parse(localStorage.getItem('reminders')) || [];
    setReminders(storedReminders);
  }, []);

  const handleDeleteReminder = (id) => {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id);
    setReminders(updatedReminders);

    // update
    localStorage.setItem('reminders', JSON.stringify(updatedReminders));
  };

  if (reminders.length === 0) {
    return <p>No reminders currently set on your profile. Scan your medication and add some!</p>;
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Your Reminders</h1>
      <ul>
        {reminders.map((reminder) => (
          <li key={reminder.id} style={{ marginBottom: '10px' }}>
            <p>
              <strong>{reminder.name}</strong>: {reminder.dosage}
            </p>
            <button
              onClick={() => handleDeleteReminder(reminder.id)}
              style={{
                backgroundColor: '#ff4d4d',
                color: 'white',
                padding: '5px 10px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Delete Reminder
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reminders;
