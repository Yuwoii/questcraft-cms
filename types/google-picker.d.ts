// Type definitions for Google Picker API
// Based on: https://developers.google.com/picker/docs

declare global {
  interface Window {
    gapi: typeof gapi
    google: {
      picker: typeof google.picker
    }
  }

  const gapi: {
    load: (api: string, callback: () => void) => void
    auth: {
      getToken: () => { access_token: string } | null
    }
  }

  namespace google {
    namespace picker {
      class PickerBuilder {
        setOAuthToken(token: string): PickerBuilder
        setDeveloperKey(key: string): PickerBuilder
        setAppId(appId: string): PickerBuilder
        setCallback(callback: (data: ResponseObject) => void): PickerBuilder
        addView(view: ViewId | View): PickerBuilder
        setTitle(title: string): PickerBuilder
        setOrigin(origin: string): PickerBuilder
        build(): Picker
      }

      interface Picker {
        setVisible(visible: boolean): void
      }

      enum ViewId {
        DOCS = 'all',
        DOCS_IMAGES = 'docs-images',
        DOCS_VIDEOS = 'docs-videos',
        DOCUMENTS = 'documents',
        SPREADSHEETS = 'spreadsheets',
        PRESENTATIONS = 'presentations',
        FOLDERS = 'folders',
      }

      class DocsView {
        constructor(viewId?: ViewId)
        setMimeTypes(mimeTypes: string): DocsView
        setMode(mode: DocsViewMode): DocsView
      }

      enum DocsViewMode {
        LIST = 'list',
        GRID = 'grid',
      }

      enum Action {
        PICKED = 'picked',
        CANCEL = 'cancel',
      }

      interface ResponseObject {
        action: Action
        docs?: Document[]
      }

      interface Document {
        id: string
        name: string
        mimeType: string
        thumbnailUrl?: string
        url: string
        sizeBytes?: number
        lastEditedUtc?: number
        description?: string
        iconUrl?: string
      }

      class View {
        constructor(viewId: ViewId)
      }
    }
  }
}

export {}

