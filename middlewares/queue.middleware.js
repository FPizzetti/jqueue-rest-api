'use strict';

module.exports = function (req, res, next) {

    if (req.params && req.params.queue) {
        var queueName = req.params.queue;
        req.jqueue.use(queueName, true, function (error, queue) {
            if (!error) {
                req.queue = queue;
                next();
            } else {
                if (error.message.match(/ER_NO_SUCH_TABLE/)) {
                    res.send(404, {message: 'queue ' + queueName + ' not found'});
                } else {
                    res.send(500, error);
                }
            }
        });
    } else {
        res.send(400, {message: 'missing queue'});
    }

};