import { CLIENT_ID, DISCOVERY_DOCS, SCOPES } from './keys'

export function loadSpreadSheetAPI (gapi) {
  return gapi.client.init({
    client_id: CLIENT_ID,
    scope: SCOPES,
    discoveryDocs: DISCOVERY_DOCS
  })
}
