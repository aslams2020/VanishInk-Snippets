package in.sb.vink;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;


@SpringBootApplication
@EnableScheduling
public class VanishInkApplication {

	public static void main(String[] args) {
		SpringApplication.run(VanishInkApplication.class, args);
	}

}
