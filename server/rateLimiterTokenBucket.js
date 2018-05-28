var TokenBucket = function(bucketSize, tokensPerInterval, interval, parentBucket) {
    this.bucketSize = bucketSize;
    this.tokensPerInterval = tokensPerInterval;
    if (typeof interval === 'string') {
      switch (interval) {
        case 'sec': case 'second':
          this.interval = 1000; break;
        case 'min': case 'minute':
          this.interval = 1000 * 60; break;
        case 'hr': case 'hour':
          this.interval = 1000 * 60 * 60; break;
        case 'day':
          this.interval = 1000 * 60 * 60 * 24; break;
        default:
          throw new Error('Invaid interval ' + interval);
      }
    } else {
      this.interval = interval;
    }
    this.parentBucket = parentBucket;
    this.content = 0;
    this.lastDrip = +new Date();
  };
  
  TokenBucket.prototype = {
    bucketSize: 1,
    tokensPerInterval: 1,
    interval: 1000,
    parentBucket: null,
    content: 0,
    lastDrip: 0,

    removeTokens: function(count, callback) {
      var self = this;
      if (!this.bucketSize) {
        process.nextTick(callback.bind(null, null, count, Number.POSITIVE_INFINITY));
        return true;
      }
      if (count > this.bucketSize) {
        process.nextTick(callback.bind(null, 'Requested tokens ' + count + ' exceeds bucket size ' +
          this.bucketSize, null));
        return false;
      }
      this.drip();
      if (count > this.content) {
        return comeBackLater();
      } 
      if (this.parentBucket) {
        return this.parentBucket.removeTokens(count, function(err, remainingTokens) {
          if (err) return callback(err, null);
          if (count > self.content)
            return comeBackLater();
          self.content -= count;
          callback(null, Math.min(remainingTokens, self.content));
        });
      } else {
        this.content -= count;
        process.nextTick(callback.bind(null, null, this.content));
        return true;
      }  
      function comeBackLater() {
        var waitInterval = Math.ceil(
          (count - self.content) * (self.interval / self.tokensPerInterval));
        setTimeout(function() { self.removeTokens(count, callback); }, waitInterval);
        return false;
      }
    },
  
    tryRemoveTokens: function(count) {
      if (!this.bucketSize)
        return true;
      if (count > this.bucketSize)
        return false;
      this.drip();
      if (count > this.content)
        return false;
      if (this.parentBucket && !this.parent.tryRemoveTokens(count))
        return false;
      this.content -= count;
      return true;
    },
  
    drip: function() {
      if (!this.tokensPerInterval) {
        this.content = this.bucketSize;
        return;
      } 
      var now = +new Date();
      var deltaMS = Math.max(now - this.lastDrip, 0);
      this.lastDrip = now;
      var dripAmount = deltaMS * (this.tokensPerInterval / this.interval);
      this.content = Math.min(this.content + dripAmount, this.bucketSize);
    }
  };
  
  module.exports = TokenBucket;