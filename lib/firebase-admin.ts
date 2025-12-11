import { initializeApp, getApps, getApp, cert, ServiceAccount } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount: ServiceAccount = {
    projectId: "college-db-b20cc",
    clientEmail: "firebase-adminsdk-fbsvc@college-db-b20cc.iam.gserviceaccount.com",
    privateKey: process.env.FIREBASE_PRIVATE_KEY
        ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
        : "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCWik/evbOYM5Bv\nvwr/MdzMpnR8+sQedn7xju+nvQYtYQoYfCy1QxMlQHhUivKXlVeTnZ1ycgwPvY+Y\nfwjgzi6iS+cXyA1M9EC2KLkrtnVXL/B24EB0md+pp+QrXgWufxnyR7IAPdFh60Zf\nk+Ad88Cym6NQuaSj8SkU9VWijr+uu39g+7cl1ClbR3CxC8KSBEbnmkE2Yq5gaGcm\n22XG+4iX1QlO7L7Jeq2gl12OWZvGF1NQ77qWyucycsRwT01BnoZaxM+Bsqbp0Tjm\n+hPrHVv75yGhnVxyjHxheN7Gny75RLLq2nGQ0STsQONQISIXf/WRN7VBPZ3CDviY\nMdnsw2g3AgMBAAECggEABGTSEvgU0K7vRXZdLaNOGgJhE7AatEw/b/Enk+JDrA8R\nL94ZTKBsuSF0wabykLO7rs54D3npBIvtr9pEBJJlWw2obOcaYvIdchOl3/Lp4YW/\n2NW6cTd33JL5aRNL9X1hNlNFt0Br/EB/49SZmIDfpsw9y+KMkyURTrrLE+e4YYhX\np8Lc3JsIXPkldCBT30mXhrgyuUK6cVreJ82dYiT4FNnTOxLE1436BYBLGmV+QoFk\nWF1+eAWmMpfUPC7BiTtLhWKTqxUrTajz/LCHN3iHcXXAgkX2Q/VEleRRwcg/uxoZ\n2PUJ8Cb0ba/kPI1wIcA4skzXrQ+gbBu8VjXnoA3riQKBgQDH64cTjSO6a61WDyhd\nYp7YFIGqnO/rqC1ErnvjLLa3SyJt0f72Y3B6T1uGaF1OPRYyYfFDK5y4FUEW8xSc\ntoAI6jDDkN6qhlLQ7nqPNQio8Lk6dRenLz1l72e8hVXcWjXKiMybPvNW5179i0nD\nvWnkBnaDUIM4WRO0xv1tPTzz/wKBgQDAxMWAlMFYVvbcKbDlVkeL0xxSJj81LiQM\nDXirB7JrNY6eIjZmAqu/tgMrqSa0/Pj8Hg7LQ0hL8eVCgrH+ovbGVRADa8Z76N5Y\nOesFZEas2B5FY43HB16g9qnW6nNMxmIMCq0oLXpsTVUX39/dVYLK4BcYv4EHVrbn\n7QJ7dRQryQKBgQCb/8JoVDLz7b/VLoC91g3C6MWBn3JrfdDNDiYnz6VIA7362elM\n061aE4CEsf1U5r/iUqDTXD2vOw6OXOHRo2rnCe9BO1M01xnaZKyIAMcgJK802Ve6\nolcTqqtU5Oppxo7A2txlq8pwHpz11XGa5ruxLgXeU74BAykoYDoyup1MewKBgBWb\neM/q3Kk8RjtzaOKsAyUHKtuCcf9SBrRbJjV1jWg6/pt3FkXk8r9wdXaFZVNQL9CC\nxgG+rvHkUWBdKfpy5dphWoQnpn3pIlMdWtyl2s4xA2OfvxqaFt9QBsWSTg5DBmZ3\nI+WnA1v0Zx9f9sXmedynta8OeDYMYEAq7uZLv1ERAoGBAIqfrKtpxLEADxzk77Ph\nb7Hp9D/Y21Loytz6jphXjUSNPP7z6kxm9q9bcMuAOv84TXIEy141TzFJQencMl5i\n+WVYBmF7+odsxoURn0ZwfYLXRVxH0Z9cjd31TCm3J4elLZVLmntigGEhmRit5m53\nXKcjduDC9wOd4hdPyhWwQzm5\n-----END PRIVATE KEY-----",
};

function getFirebaseAdminApp() {
    const apps = getApps();
    if (apps.length > 0) {
        return apps[0];
    }

    return initializeApp({
        credential: cert(serviceAccount),
    });
}

const adminApp = getFirebaseAdminApp();
export const adminDb = getFirestore(adminApp);
export const adminAuth = getAuth(adminApp);
