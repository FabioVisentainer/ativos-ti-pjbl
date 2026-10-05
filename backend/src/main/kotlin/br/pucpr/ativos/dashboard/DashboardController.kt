package br.pucpr.ativos.dashboard

import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/dashboard")
class DashboardController(private val service: DashboardService) {

    @GetMapping
    fun obter(): DashboardResponse = service.obter()
}
