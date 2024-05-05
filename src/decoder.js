function decodeJWT(token) {
    const parts = token.split('.');
    if (parts.length !== 3) {
        return { error: 'Invalid JWT format' };
    }

    const decodedPayload = JSON.parse(atob(parts[1]));
    const decodedHeader = JSON.parse(atob(parts[0]));
    const decodedSignature = parts[2];

    return {
        header: decodedHeader,
        payload: decodedPayload,
        signature: decodedSignature
    };
}
