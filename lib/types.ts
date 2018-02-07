

export interface Message {
  'historyId': string;
  'id': string;
  'internalDate': string;
  'labelIds': string[];
  'payload': MessagePart;
  'raw': string;
  'sizeEstimate': number;
  'snippet': string;
  'threadId': string;
}

export interface MessagePart {
  'body': MessagePartBody;
  'filename': string;
  'headers': MessagePartHeader[];
  'mimeType': string;
  'partId': string;
  'parts': MessagePart[];
}

export interface MessagePartBody {
  'attachmentId': string;
  'data': string;
  'size': number;
}

export interface MessagePartHeader {
  'name': string;
  'value': string;
}


export interface Thread {
  'historyId': string;
  'id': string;
  'messages': Message[];
  'snippet': string;
}


export interface History {
  'id': string;
  'labelsAdded': HistoryLabelAdded[];
  'labelsRemoved': HistoryLabelRemoved[];
  'messages': Message[];
  'messagesAdded': HistoryMessageAdded[];
  'messagesDeleted': HistoryMessageDeleted[];
}

export interface HistoryLabelAdded {
  'labelIds': string[];
  'message': Message;
}

export interface HistoryLabelRemoved {
  'labelIds': string[];
  'message': Message;
}

export interface HistoryMessageAdded {
  'message': Message;
}

export interface HistoryMessageDeleted {
  'message': Message;
}


export interface ListHistoryResponse {
  'history': History[];
  'historyId': string;
  'nextPageToken': string;
}


export interface ListThreadsResponse {
  'nextPageToken': string;
  'resultSizeEstimate': number;
  'threads': Thread[];
}

export interface ListMessagesResponse {
  'messages': Message[];
  'nextPageToken': string;
  'resultSizeEstimate': number;
}