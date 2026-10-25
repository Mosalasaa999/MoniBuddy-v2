/**
 * React Native SMS Bridge for MoniBuddy
 * Connects Native Android SMS Listener to ZeroTrustScamEngine (scamParser.ts)
 */

import { NativeModules, NativeEventEmitter, PermissionsAndroid, Platform } from 'react-native';
import { ZeroTrustScamEngine, ScamParseResult, ScamParseRequest } from './scamParser';

// 1. Interface for the Native Module exposed from Kotlin/Java
interface SmsListenerNativeModule {
  startSmsListener(): Promise<boolean>;
  stopSmsListener(): Promise<boolean>;
  requestSmsPermissions(): Promise<boolean>;
}

const { SmsListenerModule } = NativeModules;
const smsEventEmitter = SmsListenerModule ? new NativeEventEmitter(SmsListenerModule) : null;

export class SmsScamBridge {
  private engine: ZeroTrustScamEngine;

  constructor() {
    this.engine = new ZeroTrustScamEngine();
  }

  /**
   * Request necessary Android SMS permissions (RECEIVE_SMS, READ_SMS)
   */
  public async requestPermissions(): Promise<boolean> {
    if (Platform.OS !== 'android') {
      return false; // SMS broad-listening is restricted on iOS
    }

    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
        PermissionsAndroid.PERMISSIONS.READ_SMS,
      ]);

      return (
        granted[PermissionsAndroid.PERMISSIONS.RECEIVE_SMS] === PermissionsAndroid.RESULTS.GRANTED &&
        granted[PermissionsAndroid.PERMISSIONS.READ_SMS] === PermissionsAndroid.RESULTS.GRANTED
      );
    } catch (err) {
      console.error('[SmsScamBridge] Permission Request Error:', err);
      return false;
    }
  }

  /**
   * Start listening for incoming SMS messages and process them through scamParser
   */
  public startListening(onScamEvaluated: (result: ScamParseResult, rawSms: { sender: string; body: string }) => void) {
    if (!smsEventEmitter) {
      console.warn('[SmsScamBridge] Native SMS module not linked.');
      return () => {};
    }

    // Start native broadcast receiver
    SmsListenerModule.startSmsListener();

    // Subscribe to SMS received event from native Kotlin code
    const subscription = smsEventEmitter.addListener('onSmsReceived', (event: { originatingAddress: string; messageBody: string; timestamp: number }) => {
      const request: ScamParseRequest = {
        senderId: event.originatingAddress || 'UNKNOWN',
        messageBody: event.messageBody || '',
        timestamp: event.timestamp || Date.now(),
      };

      // Evaluate message sub-10ms on device
      const evaluation = this.engine.parseMessage(request);

      // Trigger callback with assessment
      onScamEvaluated(evaluation, {
        sender: request.senderId,
        body: request.messageBody,
      });
    });

    // Return cleanup function
    return () => {
      subscription.remove();
      SmsListenerModule.stopSmsListener();
    };
  }

  /**
   * Manual evaluation method for clipboard pastes or manual inputs
   */
  public evaluateText(senderId: string, messageBody: string): ScamParseResult {
    return this.engine.parseMessage({
      senderId,
      messageBody,
      timestamp: Date.now(),
    });
  }
}

export default new SmsScamBridge();
