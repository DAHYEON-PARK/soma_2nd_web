package io.vertx.example.web.chat;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.example.util.Runner;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.StaticHandler;
import io.vertx.ext.web.handler.sockjs.BridgeEvent;
import io.vertx.ext.web.handler.sockjs.BridgeOptions;
import io.vertx.ext.web.handler.sockjs.PermittedOptions;
import io.vertx.ext.web.handler.sockjs.SockJSHandler;

import java.text.DateFormat;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Date;
import java.util.Queue;

public class Server extends AbstractVerticle {

  String user_id, user_pw;

  public static void main(String[] args) {
    Runner.runExample(Server.class);
  }

  @Override
  public void start() throws Exception {

    Router router = Router.router(vertx);

    BridgeOptions opts = new BridgeOptions()
      .addInboundPermitted(new PermittedOptions().setAddress("chat.to.server"))
      .addOutboundPermitted(new PermittedOptions().setAddress("chat.to.client"));

    SockJSHandler ebHandler = SockJSHandler.create(vertx).bridge(opts);

    router.route("/eventbus/*").handler(ebHandler);
    router.route().handler(StaticHandler.create());

    vertx.createHttpServer().requestHandler(router::accept).listen(8080);

    EventBus eb = vertx.eventBus();
    eb.consumer("chat.to.server").handler(message -> {

      String[] str = ((String)message.body()).split("/");

      if(str.length == 0){
        eb.publish("chat.to.client", "no");
      }else {
        String user_id = str[0];
        String user_pw = str[1];
        System.out.println("user_id : " + user_id);
        System.out.println("user_pw : " + user_pw);

        eb.publish("chat.to.client", "ok");
      }
    });

  }
}