<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

class EventsManager {
    private $eventsFile = 'JSON/events.json';
    
    public function __construct() {
        if (!file_exists($this->eventsFile)) {
            $this->createInitialFile();
        }
    }
    
    private function createInitialFile() {
        $initialData = [
            'events' => [],
            'lastUpdated' => date('c')
        ];
        file_put_contents($this->eventsFile, json_encode($initialData, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
    
    private function readEvents() {
        $content = file_get_contents($this->eventsFile);
        return json_decode($content, true);
    }
    
    private function writeEvents($data) {
        $data['lastUpdated'] = date('c');
        file_put_contents($this->eventsFile, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
    }
    
    private function generateId($events) {
        if (empty($events)) {
            return '1';
        }
        $maxId = max(array_map('intval', array_column($events, 'id')));
        return (string)($maxId + 1);
    }
    
    public function addEvent($eventData) {
        try {
            $data = $this->readEvents();
            $requiredFields = ['title', 'description', 'date', 'time', 'location', 'category', 'troop', 'createdBy'];
            foreach ($requiredFields as $field) {
                if (empty($eventData[$field])) {
                    throw new Exception("الحقل المطلوب مفقود: $field");
                }
            }
            
            $newEvent = [
                'id' => $this->generateId($data['events']),
                'title' => $eventData['title'],
                'description' => $eventData['description'],
                'date' => $eventData['date'],
                'time' => $eventData['time'],
                'location' => $eventData['location'],
                'attendees' => $eventData['attendees'] ?? [],
                'maxAttendees' => (int)($eventData['maxAttendees'] ?? 20),
                'category' => $eventData['category'],
                'image' => $eventData['image'] ?? 'https://images.pexels.com/photos/1061640/pexels-photo-1061640.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
                'status' => $eventData['status'] ?? 'upcoming',
                'troop' => $eventData['troop'],
                'createdBy' => $eventData['createdBy'],
                'createdAt' => date('c'),
                'updatedAt' => date('c')
            ];
            
            $data['events'][] = $newEvent;
            $this->writeEvents($data);
            
            return [
                'success' => true,
                'message' => 'تم إضافة الحدث بنجاح',
                'event' => $newEvent
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    public function deleteEvent($eventId) {
        try {
            $data = $this->readEvents();
            $eventIndex = -1;
            foreach ($data['events'] as $index => $event) {
                if ($event['id'] === $eventId) {
                    $eventIndex = $index;
                    break;
                }
            }
            if ($eventIndex === -1) {
                throw new Exception('الحدث غير موجود');
            }
            $deletedEvent = $data['events'][$eventIndex];
            array_splice($data['events'], $eventIndex, 1);
            $this->writeEvents($data);
            
            return [
                'success' => true,
                'message' => 'تم حذف الحدث بنجاح',
                'deletedEvent' => $deletedEvent
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    public function updateEvent($eventId, $updateData) {
        try {
            $data = $this->readEvents();
            $eventIndex = -1;
            foreach ($data['events'] as $index => $event) {
                if ($event['id'] === $eventId) {
                    $eventIndex = $index;
                    break;
                }
            }
            if ($eventIndex === -1) {
                throw new Exception('الحدث غير موجود');
            }
            foreach ($updateData as $key => $value) {
                if (in_array($key, ['title', 'description', 'date', 'time', 'location', 'attendees', 'maxAttendees', 'category', 'image', 'status', 'troop'])) {
                    $data['events'][$eventIndex][$key] = $value;
                }
            }
            $data['events'][$eventIndex]['updatedAt'] = date('c');
            $this->writeEvents($data);
            
            return [
                'success' => true,
                'message' => 'تم تحديث الحدث بنجاح',
                'event' => $data['events'][$eventIndex]
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    public function getAllEvents() {
        try {
            $data = $this->readEvents();
            return [
                'success' => true,
                'events' => $data['events'],
                'total' => count($data['events']),
                'lastUpdated' => $data['lastUpdated']
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    public function searchEvents($searchTerm, $category = null, $status = null) {
        try {
            $data = $this->readEvents();
            $filteredEvents = [];
            foreach ($data['events'] as $event) {
                $matchesSearch = empty($searchTerm) || 
                    stripos($event['title'], $searchTerm) !== false ||
                    stripos($event['description'], $searchTerm) !== false ||
                    stripos($event['location'], $searchTerm) !== false ||
                    stripos($event['troop'], $searchTerm) !== false;
                
                $matchesCategory = empty($category) || $event['category'] === $category;
                $matchesStatus = empty($status) || $event['status'] === $status;
                
                if ($matchesSearch && $matchesCategory && $matchesStatus) {
                    $filteredEvents[] = $event;
                }
            }
            return [
                'success' => true,
                'events' => $filteredEvents,
                'total' => count($filteredEvents)
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
    
    public function getEvent($eventId) {
        try {
            $data = $this->readEvents();
            foreach ($data['events'] as $event) {
                if ($event['id'] === $eventId) {
                    return [
                        'success' => true,
                        'event' => $event
                    ];
                }
            }
            return [
                'success' => false,
                'message' => 'الحدث غير موجود'
            ];
        } catch (Exception $e) {
            return [
                'success' => false,
                'message' => $e->getMessage()
            ];
        }
    }
}

$manager = new EventsManager();
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($method) {
    case 'GET':
        if ($action === 'search') {
            $searchTerm = $_GET['q'] ?? '';
            $category = $_GET['category'] ?? '';
            $status = $_GET['status'] ?? '';
            echo json_encode($manager->searchEvents($searchTerm, $category, $status), JSON_UNESCAPED_UNICODE);
        } elseif (isset($_GET['id'])) {
            echo json_encode($manager->getEvent($_GET['id']), JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode($manager->getAllEvents(), JSON_UNESCAPED_UNICODE);
        }
        break;
        
    case 'POST':
        if ($action === 'add') {
            $input = json_decode(file_get_contents('php://input'), true);
            echo json_encode($manager->addEvent($input), JSON_UNESCAPED_UNICODE);
        } elseif ($action === 'update') {
            $input = json_decode(file_get_contents('php://input'), true);
            $eventId = $_GET['id'] ?? '';
            if (empty($eventId)) {
                echo json_encode(['success' => false, 'message' => 'معرف الحدث مطلوب'], JSON_UNESCAPED_UNICODE);
            } else {
                echo json_encode($manager->updateEvent($eventId, $input), JSON_UNESCAPED_UNICODE);
            }
        }
        break;
        
    case 'DELETE':
        $eventId = $_GET['id'] ?? '';
        if (empty($eventId)) {
            echo json_encode(['success' => false, 'message' => 'معرف الحدث مطلوب'], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode($manager->deleteEvent($eventId), JSON_UNESCAPED_UNICODE);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'طريقة طلب غير مدعومة'], JSON_UNESCAPED_UNICODE);
}
?>
