<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\Message;
use App\Models\SmsLog;
use App\Models\EmailLog;
use App\Models\MessageTemplate;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\User;
use App\Helpers\BrandingHelper;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CommunicationController extends Controller
{
    // ========== ANNOUNCEMENTS ==========
    
    /**
     * Display announcements list
     */
    public function announcements(Request $request)
    {
        $query = Announcement::with('author');

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('target_audience')) {
            $query->where('target_audience', $request->target_audience);
        }

        if ($request->filled('priority')) {
            $query->where('priority', $request->priority);
        }

        $announcements = $query->orderBy('created_at', 'desc')->paginate(20);

        $stats = [
            'total' => Announcement::count(),
            'published' => Announcement::where('status', 'published')->count(),
            'draft' => Announcement::where('status', 'draft')->count(),
            'archived' => Announcement::where('status', 'archived')->count(),
        ];

        return view('admin.communications.announcements.index', compact('announcements', 'stats'));
    }

    /**
     * Show announcement creation form
     */
    public function createAnnouncement()
    {
        return view('admin.communications.announcements.create');
    }

    /**
     * Store new announcement
     */
    public function storeAnnouncement(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'target_audience' => 'required|in:all,students,teachers,staff,parents',
            'priority' => 'required|in:low,normal,high,urgent',
            'status' => 'required|in:draft,published,archived',
            'publish_at' => 'nullable|date',
            'expire_at' => 'nullable|date|after:publish_at',
        ]);

        $validated['author_id'] = Auth::id();
        $validated['published_at'] = $request->status === 'published' ? now() : null;

        Announcement::create($validated);

        return redirect()->route('admin.communications.announcements')
            ->with('success', 'Announcement created successfully.');
    }

    /**
     * Show announcement edit form
     */
    public function editAnnouncement(Announcement $announcement)
    {
        return view('admin.communications.announcements.edit', compact('announcement'));
    }

    /**
     * Update announcement
     */
    public function updateAnnouncement(Request $request, Announcement $announcement)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'target_audience' => 'required|in:all,students,teachers,staff,parents',
            'priority' => 'required|in:low,normal,high,urgent',
            'status' => 'required|in:draft,published,archived',
            'publish_at' => 'nullable|date',
            'expire_at' => 'nullable|date|after:publish_at',
        ]);

        // Set published_at if changing to published status
        if ($request->status === 'published' && $announcement->status !== 'published') {
            $validated['published_at'] = now();
        }

        $announcement->update($validated);

        return redirect()->route('admin.communications.announcements')
            ->with('success', 'Announcement updated successfully.');
    }

    /**
     * Delete announcement
     */
    public function destroyAnnouncement(Announcement $announcement)
    {
        $announcement->delete();

        return redirect()->route('admin.communications.announcements')
            ->with('success', 'Announcement deleted successfully.');
    }

    /**
     * Publish announcement
     */
    public function publishAnnouncement(Announcement $announcement)
    {
        $announcement->update([
            'status' => 'published',
            'published_at' => now(),
        ]);

        return redirect()->back()
            ->with('success', 'Announcement published successfully.');
    }

    // ========== MESSAGES ==========
    
    /**
     * Display messages inbox
     */
    public function messages(Request $request)
    {
        $user = Auth::user();

        $query = Message::where('recipient_id', $user->id)
            ->with(['sender', 'recipient']);

        // Filters
        if ($request->filled('status')) {
            if ($request->status === 'read') {
                $query->whereNotNull('read_at');
            } elseif ($request->status === 'unread') {
                $query->whereNull('read_at');
            }
        }

        $messages = $query->orderBy('created_at', 'desc')->paginate(20);

        $stats = [
            'total' => Message::where('recipient_id', $user->id)->count(),
            'unread' => Message::where('recipient_id', $user->id)->whereNull('read_at')->count(),
            'read' => Message::where('recipient_id', $user->id)->whereNotNull('read_at')->count(),
        ];

        return view('admin.communications.messages.index', compact('messages', 'stats'));
    }

    /**
     * Show message composition form
     */
    public function composeMessage()
    {
        // Get all users for recipient selection
        $users = User::where('id', '!=', Auth::id())
            ->where('status', 'active')
            ->orderBy('name')
            ->get();

        return view('admin.communications.messages.compose', compact('users'));
    }

    /**
     * Send message
     */
    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'recipient_id' => 'required|exists:users,id',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
            'priority' => 'required|in:low,normal,high',
        ]);

        $validated['sender_id'] = Auth::id();

        Message::create($validated);

        return redirect()->route('admin.communications.messages')
            ->with('success', 'Message sent successfully.');
    }

    /**
     * View single message
     */
    public function viewMessage(Message $message)
    {
        $user = Auth::user();

        // Ensure user is sender or recipient
        if ($message->sender_id !== $user->id && $message->recipient_id !== $user->id) {
            abort(403);
        }

        // Mark as read if recipient
        if ($message->recipient_id === $user->id && !$message->read_at) {
            $message->update(['read_at' => now()]);
        }

        return view('admin.communications.messages.view', compact('message'));
    }

    /**
     * Reply to message
     */
    public function replyMessage(Request $request, Message $originalMessage)
    {
        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        Message::create([
            'sender_id' => Auth::id(),
            'recipient_id' => $originalMessage->sender_id,
            'subject' => 'Re: ' . $originalMessage->subject,
            'message' => $validated['message'],
            'priority' => 'normal',
            'parent_id' => $originalMessage->id,
        ]);

        return redirect()->back()
            ->with('success', 'Reply sent successfully.');
    }

    /**
     * Delete message
     */
    public function destroyMessage(Message $message)
    {
        $user = Auth::user();

        // Ensure user is sender or recipient
        if ($message->sender_id !== $user->id && $message->recipient_id !== $user->id) {
            abort(403);
        }

        $message->delete();

        return redirect()->route('admin.communications.messages')
            ->with('success', 'Message deleted successfully.');
    }

    // ========== SMS LOGS ==========
    
    /**
     * Display SMS logs
     */
    public function smsLogs(Request $request)
    {
        $query = SmsLog::with('user');

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('sent_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('sent_at', '<=', $request->date_to);
        }

        $smsLogs = $query->orderBy('sent_at', 'desc')->paginate(50);

        $stats = [
            'total' => SmsLog::count(),
            'sent' => SmsLog::where('status', 'sent')->count(),
            'failed' => SmsLog::where('status', 'failed')->count(),
            'pending' => SmsLog::where('status', 'pending')->count(),
        ];

        return view('admin.communications.sms.logs', compact('smsLogs', 'stats'));
    }

    /**
     * Send SMS
     */
    public function sendSms(Request $request)
    {
        $validated = $request->validate([
            'recipient_type' => 'required|in:individual,group,all_students,all_teachers',
            'recipients' => 'required_if:recipient_type,individual,group|array',
            'message' => 'required|string|max:160',
        ]);

        $recipients = $this->getRecipients($validated['recipient_type'], $validated['recipients'] ?? []);

        foreach ($recipients as $recipient) {
            SmsLog::create([
                'user_id' => $recipient['user_id'],
                'phone_number' => $recipient['phone'],
                'message' => $validated['message'],
                'status' => 'pending',
                'sent_by' => Auth::id(),
            ]);
        }

        // TODO: Integrate with SMS gateway for actual sending

        return redirect()->back()
            ->with('success', count($recipients) . ' SMS queued for sending.');
    }

    // ========== EMAIL LOGS ==========
    
    /**
     * Display email logs
     */
    public function emailLogs(Request $request)
    {
        $query = EmailLog::with('user');

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('sent_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('sent_at', '<=', $request->date_to);
        }

        $emailLogs = $query->orderBy('sent_at', 'desc')->paginate(50);

        $stats = [
            'total' => EmailLog::count(),
            'sent' => EmailLog::where('status', 'sent')->count(),
            'failed' => EmailLog::where('status', 'failed')->count(),
            'pending' => EmailLog::where('status', 'pending')->count(),
        ];

        return view('admin.communications.email.logs', compact('emailLogs', 'stats'));
    }

    /**
     * Send Email
     */
    public function sendEmail(Request $request)
    {
        $validated = $request->validate([
            'recipient_type' => 'required|in:individual,group,all_students,all_teachers',
            'recipients' => 'required_if:recipient_type,individual,group|array',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $recipients = $this->getRecipients($validated['recipient_type'], $validated['recipients'] ?? []);

        foreach ($recipients as $recipient) {
            EmailLog::create([
                'user_id' => $recipient['user_id'],
                'email' => $recipient['email'],
                'subject' => $validated['subject'],
                'message' => $validated['message'],
                'status' => 'pending',
                'sent_by' => Auth::id(),
            ]);
        }

        // TODO: Integrate with email service for actual sending

        return redirect()->back()
            ->with('success', count($recipients) . ' emails queued for sending.');
    }

    // ========== MESSAGE TEMPLATES ==========
    
    /**
     * Display message templates
     */
    public function templates()
    {
        $templates = MessageTemplate::orderBy('name')->paginate(20);

        return view('admin.communications.templates.index', compact('templates'));
    }

    /**
     * Store new template
     */
    public function storeTemplate(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:sms,email,notification',
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string',
            'variables' => 'nullable|string',
        ]);

        $validated['created_by'] = Auth::id();

        MessageTemplate::create($validated);

        return redirect()->route('admin.communications.templates')
            ->with('success', 'Template created successfully.');
    }

    /**
     * Update template
     */
    public function updateTemplate(Request $request, MessageTemplate $template)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'required|in:sms,email,notification',
            'subject' => 'nullable|string|max:255',
            'content' => 'required|string',
            'variables' => 'nullable|string',
        ]);

        $template->update($validated);

        return redirect()->route('admin.communications.templates')
            ->with('success', 'Template updated successfully.');
    }

    /**
     * Delete template
     */
    public function destroyTemplate(MessageTemplate $template)
    {
        $template->delete();

        return redirect()->route('admin.communications.templates')
            ->with('success', 'Template deleted successfully.');
    }

    // ========== BULK COMMUNICATIONS ==========
    
    /**
     * Show bulk communication form
     */
    public function bulkCommunication()
    {
        $templates = MessageTemplate::orderBy('name')->get();
        
        return view('admin.communications.bulk', compact('templates'));
    }

    /**
     * Send bulk communication
     */
    public function sendBulk(Request $request)
    {
        $validated = $request->validate([
            'channel' => 'required|in:sms,email,both',
            'recipient_type' => 'required|in:all_students,all_teachers,specific_class,specific_programme',
            'class_id' => 'required_if:recipient_type,specific_class',
            'programme_id' => 'required_if:recipient_type,specific_programme',
            'subject' => 'required_if:channel,email,both|string|max:255',
            'message' => 'required|string',
        ]);

        $recipients = $this->getBulkRecipients($validated['recipient_type'], [
            'class_id' => $request->class_id,
            'programme_id' => $request->programme_id,
        ]);

        $smsCount = 0;
        $emailCount = 0;

        foreach ($recipients as $recipient) {
            if (in_array($validated['channel'], ['sms', 'both']) && $recipient['phone']) {
                SmsLog::create([
                    'user_id' => $recipient['user_id'],
                    'phone_number' => $recipient['phone'],
                    'message' => $validated['message'],
                    'status' => 'pending',
                    'sent_by' => Auth::id(),
                ]);
                $smsCount++;
            }

            if (in_array($validated['channel'], ['email', 'both']) && $recipient['email']) {
                EmailLog::create([
                    'user_id' => $recipient['user_id'],
                    'email' => $recipient['email'],
                    'subject' => $validated['subject'] ?? 'School Notification',
                    'message' => $validated['message'],
                    'status' => 'pending',
                    'sent_by' => Auth::id(),
                ]);
                $emailCount++;
            }
        }

        $message = [];
        if ($smsCount > 0) {
            $message[] = "$smsCount SMS queued";
        }
        if ($emailCount > 0) {
            $message[] = "$emailCount emails queued";
        }

        return redirect()->back()
            ->with('success', implode(' and ', $message) . ' for sending.');
    }

    // ========== HELPER METHODS ==========
    
    /**
     * Get recipients based on type
     */
    private function getRecipients($type, $recipientIds)
    {
        $recipients = [];

        switch ($type) {
            case 'individual':
            case 'group':
                $users = User::whereIn('id', $recipientIds)->get();
                foreach ($users as $user) {
                    $recipients[] = [
                        'user_id' => $user->id,
                        'email' => $user->email,
                        'phone' => $user->phone_number ?? null,
                    ];
                }
                break;

            case 'all_students':
                $students = Student::with('user')->where('student_status', 'active')->get();
                foreach ($students as $student) {
                    $recipients[] = [
                        'user_id' => $student->user_id,
                        'email' => $student->user->email,
                        'phone' => $student->phone_number,
                    ];
                }
                break;

            case 'all_teachers':
                $teachers = Teacher::with('user')->where('teacher_status', 'active')->get();
                foreach ($teachers as $teacher) {
                    $recipients[] = [
                        'user_id' => $teacher->user_id,
                        'email' => $teacher->user->email,
                        'phone' => $teacher->phone_number,
                    ];
                }
                break;
        }

        return $recipients;
    }

    /**
     * Get bulk recipients
     */
    private function getBulkRecipients($type, $params)
    {
        $recipients = [];

        switch ($type) {
            case 'all_students':
                $students = Student::with('user')->where('student_status', 'active')->get();
                foreach ($students as $student) {
                    $recipients[] = [
                        'user_id' => $student->user_id,
                        'email' => $student->user->email,
                        'phone' => $student->phone_number,
                    ];
                }
                break;

            case 'all_teachers':
                $teachers = Teacher::with('user')->where('teacher_status', 'active')->get();
                foreach ($teachers as $teacher) {
                    $recipients[] = [
                        'user_id' => $teacher->user_id,
                        'email' => $teacher->user->email,
                        'phone' => $teacher->phone_number,
                    ];
                }
                break;

            case 'specific_class':
                $students = Student::with('user')
                    ->where('class_id', $params['class_id'])
                    ->where('student_status', 'active')
                    ->get();
                foreach ($students as $student) {
                    $recipients[] = [
                        'user_id' => $student->user_id,
                        'email' => $student->user->email,
                        'phone' => $student->phone_number,
                    ];
                }
                break;

            case 'specific_programme':
                $students = Student::with('user')
                    ->whereHas('class', function($q) use ($params) {
                        $q->where('programme_id', $params['programme_id']);
                    })
                    ->where('student_status', 'active')
                    ->get();
                foreach ($students as $student) {
                    $recipients[] = [
                        'user_id' => $student->user_id,
                        'email' => $student->user->email,
                        'phone' => $student->phone_number,
                    ];
                }
                break;
        }

        return $recipients;
    }

    /**
     * Get unread message count (for notifications)
     */
    public function unreadCount()
    {
        $count = Message::where('recipient_id', Auth::id())
            ->whereNull('read_at')
            ->count();

        return response()->json(['count' => $count]);
    }
}
