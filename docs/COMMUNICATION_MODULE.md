# Communication System Documentation

## Overview

The Communication System provides comprehensive tools for managing all types of communications within the school, including announcements, internal messaging, SMS, emails, and message templates for bulk communications.

---

## Features

### 1. Announcements Management
- **Create & Publish**: Create and publish announcements
- **Target Audiences**:
  - All users
  - Students only
  - Teachers only
  - Staff only
  - Parents only
- **Priority Levels**: Low, Normal, High, Urgent
- **Status Management**:
  - Draft: Work in progress
  - Published: Visible to target audience
  - Archived: Historical records
- **Scheduling**: Set publish and expiry dates
- **Rich Content**: Full-featured text editor support

### 2. Internal Messaging
- **Inbox System**: Full messaging inbox/outbox
- **Compose Messages**: Send to any user
- **Message Threads**: Reply to messages
- **Read Status**: Track read/unread messages
- **Priority Markers**: Low, Normal, High
- **Message History**: Complete conversation history
- **Unread Count**: Real-time unread message counter
- **Search & Filter**: Find messages quickly

### 3. SMS Communication
- **Send SMS**: Send text messages to users
- **Bulk SMS**: Mass SMS to groups
- **Target Groups**:
  - Individual users
  - Custom groups
  - All students
  - All teachers
  - Specific class
  - Specific programme
- **SMS Logs**: Complete delivery tracking
- **Status Tracking**: Sent, Failed, Pending
- **Character Limit**: 160 characters
- **Delivery Reports**: View send status

### 4. Email Communication
- **Send Emails**: Send emails to users
- **Bulk Emails**: Mass emails to groups
- **Rich HTML**: Formatted email content
- **Subject Lines**: Custom email subjects
- **Target Groups**: Same as SMS
- **Email Logs**: Complete delivery tracking
- **Status Tracking**: Sent, Failed, Pending
- **Attachment Support**: (Future enhancement)

### 5. Message Templates
- **Template Library**: Reusable message templates
- **Template Types**:
  - SMS templates
  - Email templates
  - Notification templates
- **Variable Support**: Dynamic content placeholders
- **Quick Access**: Use templates for bulk sending
- **Template Management**: CRUD operations

### 6. Bulk Communication
- **Multi-Channel**: Send via SMS, Email, or Both
- **Smart Targeting**: Audience-based filtering
- **Template Integration**: Use saved templates
- **Preview**: Preview before sending
- **Queue System**: Background sending
- **Delivery Stats**: Track success rates

---

## Database Tables

### announcements
```sql
- id
- title (string)
- content (text)
- author_id (FK to users)
- target_audience (enum: all, students, teachers, staff, parents)
- priority (enum: low, normal, high, urgent)
- status (enum: draft, published, archived)
- published_at (datetime, nullable)
- publish_at (datetime, nullable)
- expire_at (datetime, nullable)
- timestamps
```

### messages
```sql
- id
- sender_id (FK to users)
- recipient_id (FK to users)
- subject (string)
- message (text)
- priority (enum: low, normal, high)
- read_at (datetime, nullable)
- parent_id (FK to messages, nullable)
- timestamps
```

### sms_logs
```sql
- id
- user_id (FK to users, nullable)
- phone_number (string)
- message (text)
- status (enum: pending, sent, failed)
- sent_at (datetime, nullable)
- sent_by (FK to users)
- error_message (text, nullable)
- timestamps
```

### email_logs
```sql
- id
- user_id (FK to users, nullable)
- email (string)
- subject (string)
- message (text)
- status (enum: pending, sent, failed)
- sent_at (datetime, nullable)
- sent_by (FK to users)
- error_message (text, nullable)
- timestamps
```

### message_templates
```sql
- id
- name (string)
- type (enum: sms, email, notification)
- subject (string, nullable)
- content (text)
- variables (text, nullable)
- created_by (FK to users)
- timestamps
```

---

## Controller Methods

### CommunicationController

#### Announcements (7 methods)
1. `announcements()` - List all announcements with filters
2. `createAnnouncement()` - Show creation form
3. `storeAnnouncement()` - Save new announcement
4. `editAnnouncement()` - Show edit form
5. `updateAnnouncement()` - Update announcement
6. `destroyAnnouncement()` - Delete announcement
7. `publishAnnouncement()` - Publish draft announcement

#### Messages (6 methods)
8. `messages()` - View inbox
9. `composeMessage()` - Show compose form
10. `sendMessage()` - Send new message
11. `viewMessage()` - View single message (mark as read)
12. `replyMessage()` - Reply to message
13. `destroyMessage()` - Delete message

#### SMS (2 methods)
14. `smsLogs()` - View SMS delivery logs
15. `sendSms()` - Send SMS to recipients

#### Email (2 methods)
16. `emailLogs()` - View email delivery logs
17. `sendEmail()` - Send email to recipients

#### Templates (3 methods)
18. `templates()` - List all templates
19. `storeTemplate()` - Create new template
20. `updateTemplate()` - Update template
21. `destroyTemplate()` - Delete template

#### Bulk Communication (2 methods)
22. `bulkCommunication()` - Show bulk send form
23. `sendBulk()` - Send bulk SMS/Email

#### Helpers (3 methods)
24. `getRecipients()` - Get recipient list (private)
25. `getBulkRecipients()` - Get bulk recipient list (private)
26. `unreadCount()` - Get unread message count (AJAX)

---

## Routes

### Admin Routes (Prefix: /admin/communications)

```php
// Announcements
GET    /admin/communications/announcements                     - communications.announcements
GET    /admin/communications/announcements/create              - communications.announcements.create
POST   /admin/communications/announcements                     - communications.announcements.store
GET    /admin/communications/announcements/{announcement}/edit - communications.announcements.edit
PUT    /admin/communications/announcements/{announcement}      - communications.announcements.update
DELETE /admin/communications/announcements/{announcement}      - communications.announcements.destroy
POST   /admin/communications/announcements/{announcement}/publish - communications.announcements.publish

// Messages
GET    /admin/communications/messages                - communications.messages
GET    /admin/communications/messages/compose        - communications.messages.compose
POST   /admin/communications/messages/send           - communications.messages.send
GET    /admin/communications/messages/{message}      - communications.messages.view
POST   /admin/communications/messages/{message}/reply - communications.messages.reply
DELETE /admin/communications/messages/{message}      - communications.messages.destroy

// SMS
GET    /admin/communications/sms/logs                - communications.sms.logs
POST   /admin/communications/sms/send                - communications.sms.send

// Email
GET    /admin/communications/email/logs              - communications.email.logs
POST   /admin/communications/email/send              - communications.email.send

// Templates
GET    /admin/communications/templates               - communications.templates
POST   /admin/communications/templates               - communications.templates.store
PUT    /admin/communications/templates/{template}    - communications.templates.update
DELETE /admin/communications/templates/{template}    - communications.templates.destroy

// Bulk Communication
GET    /admin/communications/bulk                    - communications.bulk
POST   /admin/communications/bulk/send               - communications.bulk.send

// AJAX
GET    /admin/communications/messages/unread/count   - communications.messages.unread
```

---

## Usage Examples

### Creating Announcement

```php
$announcement = Announcement::create([
    'title' => 'Mid-Term Exams Timetable',
    'content' => 'The mid-term exams will begin on...',
    'author_id' => Auth::id(),
    'target_audience' => 'students',
    'priority' => 'high',
    'status' => 'published',
    'published_at' => now(),
    'expire_at' => Carbon::now()->addDays(30),
]);
```

### Sending Internal Message

```php
Message::create([
    'sender_id' => Auth::id(),
    'recipient_id' => $recipientId,
    'subject' => 'Regarding your exam performance',
    'message' => 'I would like to discuss...',
    'priority' => 'normal',
]);
```

### Sending Bulk SMS

```php
$students = Student::where('class_id', $classId)
    ->where('student_status', 'active')
    ->get();

foreach ($students as $student) {
    SmsLog::create([
        'user_id' => $student->user_id,
        'phone_number' => $student->phone_number,
        'message' => 'Reminder: Fees due by Friday',
        'status' => 'pending',
        'sent_by' => Auth::id(),
    ]);
}

// Process queue
// Queue::push(new SendSmsJob());
```

### Creating Message Template

```php
MessageTemplate::create([
    'name' => 'Fee Reminder',
    'type' => 'sms',
    'content' => 'Dear {student_name}, your fees balance is {amount}. Please pay by {due_date}.',
    'variables' => 'student_name, amount, due_date',
    'created_by' => Auth::id(),
]);
```

### Using Template with Variables

```php
$template = MessageTemplate::find($templateId);
$message = $template->content;

// Replace variables
$message = str_replace('{student_name}', $student->name, $message);
$message = str_replace('{amount}', BrandingHelper::formatCurrency($balance), $message);
$message = str_replace('{due_date}', $dueDate->format('d/m/Y'), $message);

// Send
SmsLog::create([
    'user_id' => $student->user_id,
    'phone_number' => $student->phone_number,
    'message' => $message,
    'status' => 'pending',
    'sent_by' => Auth::id(),
]);
```

---

## Business Rules

### Announcements
1. Only administrators can create announcements
2. Draft announcements not visible to users
3. Published announcements visible to target audience only
4. Expired announcements automatically hidden
5. Scheduled announcements publish at specified time
6. Author cannot be changed after creation
7. Urgent priority shows alert badge

### Messages
1. Users can only send to active users
2. Recipients marked as read when viewed
3. Message threads linked via parent_id
4. Reply subject auto-prefixed with "Re:"
5. Users can delete own messages (sent/received)
6. Deleted messages soft-deleted (optional)
7. Unread count updates in real-time

### SMS/Email
1. Phone number/email validated before sending
2. Failed messages logged with error details
3. Pending messages queued for retry
4. Sent messages logged with timestamp
5. Duplicate prevention (optional debounce)
6. Rate limiting to prevent spam
7. Cost tracking for SMS (future)

### Bulk Communication
1. Verify recipients exist and are active
2. Filter out invalid phone/email addresses
3. Queue messages for background processing
4. Track success/failure rates
5. Limit concurrent sends to prevent overload
6. Admin approval for large batches (optional)
7. Preview before sending

---

## Recipient Targeting

### Target Types

**Individual**
- Select specific user by ID

**Group**
- Select multiple users manually

**All Students**
- All active students in the system

**All Teachers**
- All active teachers in the system

**Specific Class**
- All students in selected class

**Specific Programme**
- All students in programme's classes

**Custom Filters** (Future)
- By attendance rate
- By fee balance
- By academic performance
- By gender
- By admission year

---

## Template Variables

### Available Variables

**Student Variables:**
- `{student_name}` - Full name
- `{admission_number}` - Admission number
- `{class_name}` - Current class
- `{programme_name}` - Programme enrolled

**Fee Variables:**
- `{amount}` - Amount (formatted)
- `{balance}` - Outstanding balance
- `{due_date}` - Payment due date
- `{receipt_number}` - Receipt reference

**Academic Variables:**
- `{exam_name}` - Examination name
- `{exam_date}` - Exam date
- `{marks}` - Marks obtained
- `{grade}` - Grade achieved
- `{gpa}` - GPA score

**General Variables:**
- `{school_name}` - Institution name
- `{academic_year}` - Current year
- `{semester}` - Current semester
- `{date}` - Today's date
- `{contact}` - School contact

---

## Integration Points

### SMS Gateway Integration

```php
// Example SMS API integration
public function sendViaSmsGateway($phoneNumber, $message)
{
    $apiKey = config('services.sms.api_key');
    $senderId = config('services.sms.sender_id');
    
    $response = Http::post('https://sms-api.example.com/send', [
        'api_key' => $apiKey,
        'sender_id' => $senderId,
        'phone' => $phoneNumber,
        'message' => $message,
    ]);
    
    return $response->json();
}
```

### Email Service Integration

```php
// Example using Laravel Mail
use Illuminate\Support\Facades\Mail;

Mail::to($recipient->email)->send(
    new SchoolNotification($subject, $message)
);
```

### Real-time Notifications

```php
// Using Laravel Broadcasting
event(new NewMessageReceived($message));
```

---

## Security Features

### 1. Access Control
- Role-based permissions
- Only admins can send bulk communications
- Users can only delete own messages
- Announcements restricted by target audience

### 2. Data Validation
- Phone number format validation
- Email address validation
- Message length limits
- XSS protection on content

### 3. Privacy Protection
- Recipients cannot see other recipients (BCC)
- Personal information masked in logs
- Secure message storage
- GDPR compliance ready

### 4. Rate Limiting
- Prevent spam/abuse
- API rate limits for gateways
- Per-user sending limits
- Time-based throttling

---

## Statistics Available

### Announcements Stats
- Total announcements
- Published count
- Draft count
- Archived count
- By priority
- By target audience

### Messages Stats
- Total messages
- Unread count
- Read count
- By sender
- By date range

### SMS Stats
- Total sent
- Success rate
- Failed count
- Pending count
- Cost tracking (future)

### Email Stats
- Total sent
- Success rate
- Failed count
- Pending count
- Open rate (future)

---

## Future Enhancements

### 1. Advanced Features
- **Push Notifications**: Mobile app notifications
- **In-app Notifications**: Bell icon with dropdown
- **Email Attachments**: Send files via email
- **SMS Delivery Reports**: Real-time delivery status
- **Message Scheduling**: Schedule for future send
- **Auto-responses**: Automated reply templates
- **Message Archiving**: Archive old messages
- **Advanced Search**: Full-text search

### 2. Analytics
- **Engagement Metrics**: Open/click rates
- **Response Rates**: Track message replies
- **Peak Times**: Best times to send
- **User Preferences**: Communication preferences
- **Cost Analysis**: SMS/Email costs
- **ROI Tracking**: Campaign effectiveness

### 3. Integration
- **WhatsApp Business**: WhatsApp integration
- **Telegram**: Telegram bot
- **USSD**: USSD menu system
- **Voice Calls**: Automated voice messages
- **Social Media**: Facebook/Twitter posting
- **Calendar Sync**: Google Calendar events

### 4. User Experience
- **Rich Text Editor**: Formatting tools
- **Emoji Support**: Emoji picker
- **File Sharing**: Share documents
- **Group Chat**: Multiple participants
- **Video Messages**: Record video
- **Voice Notes**: Audio messages
- **Message Reactions**: Like/reactions
- **Read Receipts**: Seen indicators

---

## Permissions Matrix

| Feature                  | Admin | Principal | Teacher | Student |
|-------------------------|-------|-----------|---------|---------|
| Create Announcements    | ✓     | ✓         | ✗       | ✗       |
| View Announcements      | ✓     | ✓         | ✓       | ✓       |
| Send Messages           | ✓     | ✓         | ✓       | ✓       |
| Send Bulk SMS           | ✓     | ✓         | ✗       | ✗       |
| Send Bulk Email         | ✓     | ✓         | ✗       | ✗       |
| View SMS Logs           | ✓     | ✓         | ✗       | ✗       |
| View Email Logs         | ✓     | ✓         | ✗       | ✗       |
| Create Templates        | ✓     | ✓         | ✗       | ✗       |
| Use Templates           | ✓     | ✓         | ✗       | ✗       |

---

## Testing

### Unit Tests
```bash
php artisan test --filter CommunicationTest
```

### Test Cases
- Create announcement
- Publish announcement
- Send internal message
- Reply to message
- Send bulk SMS
- Send bulk email
- Create template
- Use template with variables
- Target specific class
- Get unread count

---

## Troubleshooting

### Common Issues

**Issue**: SMS not sending
- **Solution**: Check SMS gateway configuration and credentials

**Issue**: Email delivery failures
- **Solution**: Verify SMTP settings and email service status

**Issue**: Unread count not updating
- **Solution**: Check AJAX endpoint and JavaScript implementation

**Issue**: Template variables not replacing
- **Solution**: Ensure variable names match exactly with curly braces

**Issue**: Bulk send timeout
- **Solution**: Implement queue system for background processing

---

**Module Status**: ✅ Completed
**Last Updated**: 2024
**Maintained By**: Combridge Centre for Polytechnic Studies
